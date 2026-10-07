-- Initial schema. Never edit a migration that has already run: add a new V2__... file instead.

CREATE TABLE app_user (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL,
    phone         VARCHAR(10)  NOT NULL,
    blood_group   VARCHAR(3)   NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role          VARCHAR(10)  NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'DONOR')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
-- Emails are unique regardless of upper/lower case.
CREATE UNIQUE INDEX ux_app_user_email ON app_user (LOWER(email));

CREATE TABLE refresh_token (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    -- Only a SHA-256 hash is stored, so a database leak doesn't reveal usable tokens.
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_refresh_token_user ON refresh_token (user_id);

CREATE TABLE donor (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    blood_group VARCHAR(3)  NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    phone       VARCHAR(10) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE donation (
    id            BIGSERIAL PRIMARY KEY,
    -- Deleting a donor deletes their donation history too.
    donor_id      BIGINT       NOT NULL REFERENCES donor (id) ON DELETE CASCADE,
    donation_date DATE         NOT NULL,
    quantity_ml   INTEGER      NOT NULL CHECK (quantity_ml BETWEEN 350 AND 450),
    location      VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX ix_donation_donor_date ON donation (donor_id, donation_date);
