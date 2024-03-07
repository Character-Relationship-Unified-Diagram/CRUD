CREATE TABLE "characters" (
  "character_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "character_name" text UNIQUE NOT NULL,
  "faction_id" uuid,
  "map_id" uuid,
  "character_descriptor" text NOT NULL
);
CREATE TABLE "char_attributes" (
  "char_attr_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "char_id" uuid,
  "attr_value" jsonb
);
CREATE TABLE "factions" (
  "faction_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "faction_name" text UNIQUE NOT NULL
);
CREATE TABLE "statuses" (
  "status_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "status_name" text UNIQUE NOT NULL
);
CREATE TABLE "char_statuses" (
  "char_stat_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "status_id" uuid,
  "char_sender" uuid,
  "char_recipient" uuid
);
CREATE TABLE "faction_statuses" (
  "faction_stat_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "status_id" uuid,
  "faction_sender" uuid,
  "faction_recipient" uuid
);
CREATE TABLE "maps" (
  "map_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "owner_id" uuid,
  "map_name" text UNIQUE NOT NULL DEFAULT 'Untitled'
);
CREATE TABLE "users" (
  "user_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "username" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "created_at" timestamp NOT NULL
);
ALTER TABLE "characters"
ADD CONSTRAINT fk_faction_id
ADD FOREIGN KEY ("faction_id") REFERENCES "factions" ("faction_id");
ALTER TABLE "characters"
ADD CONSTRAINT fk_char_map_id
ADD FOREIGN KEY ("map_id") REFERENCES "maps" ("map_id")
ALTER TABLE "faction_statuses"
ADD CONSTRAINT fk_faction_sender
ADD FOREIGN KEY ("faction_sender") REFERENCES "factions" ("faction_id");
ALTER TABLE "faction_statuses"
ADD CONSTRAINT fk_faction_recipient
ADD FOREIGN KEY ("faction_recipient") REFERENCES "factions" ("faction_id");
ALTER TABLE "faction_statuses"
ADD CONSTRAINT fk_faction_status_id
ADD FOREIGN KEY ("status_id") REFERENCES "statuses" ("status_id");
ALTER TABLE "char_statuses"
ADD CONSTRAINT fk_char_status_id
ADD FOREIGN KEY ("status_id") REFERENCES "statuses" ("status_id");
ALTER TABLE "char_statuses"
ADD CONSTRAINT fk_char_sender
ADD FOREIGN KEY ("char_sender") REFERENCES "characters" ("character_id");
ALTER TABLE "char_statuses"
ADD CONSTRAINT fk_char_recipient
ADD FOREIGN KEY ("char_recipient") REFERENCES "characters" ("character_id");
ALTER TABLE "maps"
ADD CONSTRAINT fk_map_id
ADD FOREIGN KEY ("map_id") REFERENCES "characters" ("map_id");
ALTER TABLE "char_attributes"
ADD CONSTRAINT fk_char_id
ADD FOREIGN KEY ("char_id") REFERENCES "characters" ("character_id");
ALTER TABLE "maps"
ADD CONSTRAINT fk_owner_id
ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("user_id");