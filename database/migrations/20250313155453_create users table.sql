-- migrate:up
CREATE TABLE "refresh_token_states" (
    "id" UUID NOT NULL,
    "user_agent" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "refresh_token_states_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_47b9e0ffdd6f9e04a6985a99eb" ON "refresh_token_states"("user_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
ALTER TABLE "refresh_token_states" ADD CONSTRAINT "refresh_token_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- migrate:down

ALTER TABLE "refresh_token_states" DROP CONSTRAINT "refresh_token_states_user_id_fkey";
DROP INDEX IF EXISTS "IDX_47b9e0ffdd6f9e04a6985a99eb";
DROP INDEX IF EXISTS "users_email_key";
DROP TABLE IF EXISTS "refresh_token_states";
DROP TABLE IF EXISTS "users";
