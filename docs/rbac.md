# Role-based access control

Every account has exactly **one role**. Pages are allowed per role, actions per permission, and the backend
enforces every rule on every request: the frontend only decides what to show.

## Roles

| Role      | Who                                     | How the account is created                                 |
| --------- | --------------------------------------- | ---------------------------------------------------------- |
| **ADMIN** | Blood bank manager / system admin       | Seeded, or promoted by another Admin on the Users page     |
| **STAFF** | Nurse or desk staff recording donations | Promoted by an Admin on the Users page                     |
| **DONOR** | A person who donates blood              | Self-registration. Always DONOR: a `role` field is ignored |

## What each role can do

| Action                                      | ADMIN | STAFF | DONOR |
| ------------------------------------------- | :---: | :---: | :---: |
| Dashboard                                   |   ✓   |   ✓   |   ✓   |
| View, search and page through donors        |   ✓   |   ✓   |       |
| View a donor's donation history             |   ✓   |   ✓   |       |
| Add / edit donors                           |   ✓   |   ✓   |       |
| Add / edit donations (90-day rule enforced) |   ✓   |   ✓   |       |
| Delete donors and donations                 |   ✓   |       |       |
| Manage accounts (roles, enable / disable)   |   ✓   |       |       |

Deletes are Admin-only because they destroy medical history, and they always ask for confirmation first.

## Where the rules are enforced

### Backend: the real gate

| Concern           | Implementation                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Who may call what | One list in `config/SecurityConfig.java`; anything not listed is denied (`anyRequest().denyAll()`)                                                                                         |
| Who is calling    | A signed JWT access token (15 min) identifies the user                                                                                                                                     |
| Current rights    | `CurrentUserAuthenticationConverter` loads the user from the database on **every** request: a disabled account gets 401 and the role comes from the database, so changes apply immediately |
| Answers           | 401 = not logged in, expired or disabled; 403 = logged in but not allowed                                                                                                                  |
| Registration      | Always creates DONOR; the request can't choose a role                                                                                                                                      |

```java
.requestMatchers("/api/users/**").hasRole(ADMIN)
.requestMatchers(DELETE, "/api/donors/**", "/api/donations/**").hasRole(ADMIN)
.requestMatchers("/api/donors/**", "/api/donations/**").hasAnyRole(ADMIN, STAFF)
.anyRequest().denyAll()
```

### Frontend: user experience only

Hiding a page or button doesn't stop anyone from calling the API, which is why the backend checks everything.
Every place that hides something says so in a comment.

| Concern                 | Implementation                                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages and menu items    | `ROUTE_ROLES` in `src/constants/roles.js`, read by both `RoleRoute` (shows a 403 page) and the `Sidebar`, so a page and its menu item can never disagree |
| Buttons                 | `ROLE_PERMISSIONS` + `useCrudPermissions` decide whether Add / Edit / Delete appear                                                                      |
| Logged-out vs logged-in | `ProtectedRoute` sends logged-out users to Login; `GuestRoute` keeps logged-in users away from Login                                                     |
| Server refusals         | A 403 from the API is shown as "You do not have permission to do this."                                                                                  |

## Managing accounts

On the **Users** page an Admin can change a user's role and disable or enable an account
(`PATCH /api/users/{id}`).

- **Takes effect immediately.** Because every request is checked against the database, a disabled account is
  refused on its next request and a new role applies at once. A plain JWT setup would keep the old rights until the
  token expires (up to 15 minutes). The cost is one primary-key lookup per request.
- **Sessions end.** Disabling or changing a role also revokes all of that user's refresh tokens.
- **No self-changes.** An Admin can't disable or demote their own account (400, and no buttons on their own row),
  so the last Admin can't lock everyone out.
- **Disabled login.** Only after a correct password is the user told the account is disabled (403); a wrong
  password gets the usual generic message, so account status is never revealed to someone guessing.

## Known limitation: donor records aren't linked to login accounts

|                                  | Created by                       | Has                                       | Can log in |
| -------------------------------- | -------------------------------- | ----------------------------------------- | ---------- |
| **Donor record** (`donor` table) | Staff, on the Donors page        | Name, blood group, phone, donations       | No         |
| **Account** (`app_user` table)   | The person, on the Register page | Name, email, password, phone, blood group | Yes        |

A DONOR account therefore can't see its own donation history yet.

**Why not link them by phone number?** Donation history is medical data. Matching on an unverified phone number
would let anyone register with someone else's number and read their records. A safe link needs verified identity:
an SMS/OTP or email-verification service, or staff checking ID in person.

**Planned design:**

1. A nullable, unique `donor.user_id` column referencing `app_user(id)`.
2. Staff link an account to a donor record after verifying identity; optionally, automatic linking after phone OTP.
3. A "My donations" page for DONOR users (`GET /api/me/donations`) with a backend ownership check
   (`donor.userId == currentUser.id`), showing their eligibility.
4. Optionally, staff send an email invitation so donors they added can create an already-linked account.
