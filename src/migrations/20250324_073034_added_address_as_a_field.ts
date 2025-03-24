import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  CREATE TYPE "public"."enum_contacts_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  CREATE TYPE "public"."enum_history_entity_type" AS ENUM('location', 'contact');
  CREATE TYPE "public"."enum_history_change_type" AS ENUM('create', 'update', 'delete');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'inProgress', 'resolved');
  CREATE TABLE IF NOT EXISTS "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"website" varchar,
  	"email" varchar,
  	"phone_number" varchar,
  	"address_country" varchar DEFAULT 'USA',
  	"address_address_line1" varchar NOT NULL,
  	"address_address_line2" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_phone" varchar NOT NULL,
  	"address_latitude" numeric,
  	"address_longitude" numeric,
  	"address_geocoding_status" "enum_locations_address_geocoding_status" DEFAULT 'not_geocoded',
  	"address_last_geocoded_at" timestamp(3) with time zone,
  	"notes" jsonb,
  	"schedule" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"full_name" varchar,
  	"email" varchar,
  	"phone_number" varchar,
  	"address_country" varchar DEFAULT 'USA',
  	"address_address_line1" varchar NOT NULL,
  	"address_address_line2" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_phone" varchar NOT NULL,
  	"address_latitude" numeric,
  	"address_longitude" numeric,
  	"address_geocoding_status" "enum_contacts_address_geocoding_status" DEFAULT 'not_geocoded',
  	"address_last_geocoded_at" timestamp(3) with time zone,
  	"location_id" integer,
  	"notes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "history_changed_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_name" varchar NOT NULL,
  	"old_value" varchar,
  	"new_value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"entity_type" "enum_history_entity_type" NOT NULL,
  	"entity_id" varchar NOT NULL,
  	"location_id" integer,
  	"contact_id" integer,
  	"previous_data" jsonb,
  	"new_data" jsonb,
  	"change_type" "enum_history_change_type" NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"regarding" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contacts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "history_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  DO $$ BEGIN
   ALTER TABLE "contacts" ADD CONSTRAINT "contacts_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "history_changed_fields" ADD CONSTRAINT "history_changed_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "history" ADD CONSTRAINT "history_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "history" ADD CONSTRAINT "history_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "contacts_location_idx" ON "contacts" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "history_changed_fields_order_idx" ON "history_changed_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "history_changed_fields_parent_id_idx" ON "history_changed_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "history_location_idx" ON "history" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "history_contact_idx" ON "history" USING btree ("contact_id");
  CREATE INDEX IF NOT EXISTS "history_updated_at_idx" ON "history" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "history_created_at_idx" ON "history" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_fk" FOREIGN KEY ("history_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_history_id_idx" ON "payload_locked_documents_rels" USING btree ("history_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history_changed_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "history_changed_fields" CASCADE;
  DROP TABLE "history" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_locations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contacts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_history_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_locations_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_contacts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_history_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "locations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contacts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "history_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contact_submissions_id";
  DROP TYPE "public"."enum_locations_address_geocoding_status";
  DROP TYPE "public"."enum_contacts_address_geocoding_status";
  DROP TYPE "public"."enum_history_entity_type";
  DROP TYPE "public"."enum_history_change_type";
  DROP TYPE "public"."enum_contact_submissions_status";`)
}
