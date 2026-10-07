# Blood Donation Registry: Backend

Spring Boot REST API for the Blood Donation Registry: login and roles, donors, donations and the 90-day eligibility
rule, stored in PostgreSQL.

| Part      | Choice                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Language  | Java 21 (LTS)                                                                     |
| Framework | Spring Boot 4.1: Web MVC, Data JPA, Validation, Security (OAuth2 Resource Server) |
| Database  | PostgreSQL 17 in Docker Compose; tables created by Flyway migrations              |
| Auth      | Short-lived JWT access token + rotating refresh token in an HttpOnly cookie       |
| Build     | Maven Wrapper (`./mvnw`): no Maven installation needed                            |
| Tests     | JUnit 5, MockMvc, Testcontainers (a real PostgreSQL per test run)                 |

## Run it

Needs **Java 21** and **Docker with Compose**. From this `backend/` folder:

```bash
cp .env.example .env               # once; then fill in DB_PASSWORD and JWT_SECRET
openssl rand -base64 48            # paste the output as JWT_SECRET in .env
docker compose up -d               # starts PostgreSQL on 127.0.0.1:5432
./mvnw spring-boot:run             # starts the API on http://localhost:8080
```

On first start Flyway creates the tables, and with `DEMO_DATA=true` the demo accounts, donors and donations are
added (see the main README for the logins). Stop with Ctrl+C and `docker compose down` (add `-v` to also delete
the data).

### Environment variables (`backend/.env`, never committed)

| Variable      | Example                                           | Meaning                                     |
| ------------- | ------------------------------------------------- | ------------------------------------------- |
| `DB_URL`      | `jdbc:postgresql://localhost:5432/blood_donation` | Database address                            |
| `DB_USERNAME` | `bdr_app`                                         | Database user (Compose creates it)          |
| `DB_PASSWORD` | random                                            | Database password (Compose sets it)         |
| `JWT_SECRET`  | output of `openssl rand -base64 48`               | Signs access tokens; at least 32 characters |
| `DEMO_DATA`   | `true` locally                                    | Fill an empty database with demo data       |

The same `.env` is read by Docker Compose and by Spring Boot, so the database and the app always agree. The app
refuses to start without a strong `JWT_SECRET`.

## Tests

```bash
./mvnw test
```

Testcontainers starts a throwaway PostgreSQL in Docker, so the tests use the real database engine. On **macOS with
Colima** (instead of Docker Desktop) set these first:

```bash
export DOCKER_HOST="unix://$HOME/.colima/default/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
```

On Linux with Docker Engine nothing extra is needed.

## How the code is organised

```
src/main/java/com/blooddonation/registry/
├── config/      SecurityConfig (who may call what), JwtConfig, AppSecurityProperties, ClockConfig
├── auth/        AuthController, AuthService, AccessTokenService (JWT), RefreshTokenService, RefreshCookies
├── user/        AppUser, Role, UserRepository, UserController (GET /api/users)
├── donor/       Donor, DonorRepository, DonorService, DonorController
├── donation/    Donation, DonationService, DonationController, DonationEligibility (the 90-day rule)
├── common/      ApiExceptionHandler (errors → HTTP status), exceptions, ValidationRules, PageResponse
└── demo/        DemoDataSeeder (DEMO_DATA=true only)
src/main/resources/
├── application.yaml
└── db/migration/V1__create_tables.sql
```

Each feature has the same layers: **Controller** (HTTP in/out, `@Valid`) → **Service** (rules, transactions) →
**Repository** (database).

## Security, in short

- **Who may call what** is one list in `SecurityConfig`: auth endpoints are open; reading/adding/editing donors and
  donations needs ADMIN or STAFF; deleting and `GET /api/users` need ADMIN; everything else is denied.
- **Access token**: a JWT signed with `JWT_SECRET`, valid 15 minutes, carrying the user id and role. Missing,
  expired or tampered → **401**. Valid but wrong role → **403**.
- **Refresh token**: 32 random bytes in an `HttpOnly; Secure; SameSite=Strict; Path=/api/auth` cookie, valid
  30 minutes since last use. The database stores only its SHA-256 hash. Each refresh replaces it (rotation);
  if an old one is ever used again, every session of that user is ended (theft detection).
- **Passwords**: BCrypt. Login answers the same for "unknown email" and "wrong password", and takes the same time.
- **Registration** always creates a DONOR; a `role` field in the request is ignored.
- **Errors**: RFC 9457 problem-details JSON; stack traces and internal messages never reach the client.
- **Database**: PostgreSQL is bound to 127.0.0.1 only; secrets come from `.env`, which Git ignores.

## Business rules

| Rule                                         | Where                                       | Answer |
| -------------------------------------------- | ------------------------------------------- | ------ |
| Donations at least 90 days apart (both ways) | `DonationEligibility` via `DonationService` | 422    |
| Donation date not in the future              | `DonationService`                           | 400    |
| Quantity 350–450 ml, required fields         | `DonationRequest` annotations + DB check    | 400    |
| Unique donor phone / account email           | Services + unique constraints               | 409    |
| Deleting a donor deletes their donations     | `ON DELETE CASCADE` in the migration        | 204    |

While a donation is saved, the donor's row is locked (`findByIdForUpdate`), so two staff members adding donations
for the same donor at the same moment can't both pass the 90-day check.
