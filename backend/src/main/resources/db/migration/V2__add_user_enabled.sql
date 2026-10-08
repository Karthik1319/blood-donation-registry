-- Admins can disable accounts. Existing accounts stay enabled.
ALTER TABLE app_user ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE;
