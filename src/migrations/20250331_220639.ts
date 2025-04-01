import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "history_changed_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "history_changed_fields" CASCADE;
  DROP TABLE "history" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_history_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_history_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "history_id";
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_locations_address_geocoding_status";
  CREATE TYPE "public"."enum_locations_address_geocoding_status" AS ENUM('not_geocoded', 'geocoding', 'geocoded', 'failed');
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_locations_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_locations_address_geocoding_status";
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_contacts_address_geocoding_status";
  CREATE TYPE "public"."enum_contacts_address_geocoding_status" AS ENUM('not_geocoded', 'geocoding', 'geocoded', 'failed');
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_contacts_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_contacts_address_geocoding_status";
  DROP TYPE "public"."enum_history_entity_type";
  DROP TYPE "public"."enum_history_change_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_history_entity_type" AS ENUM('location', 'contact');
  CREATE TYPE "public"."enum_history_change_type" AS ENUM('create', 'update', 'delete');
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "history_id" integer;
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
  
  CREATE INDEX IF NOT EXISTS "history_changed_fields_order_idx" ON "history_changed_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "history_changed_fields_parent_id_idx" ON "history_changed_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "history_location_idx" ON "history" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "history_contact_idx" ON "history" USING btree ("contact_id");
  CREATE INDEX IF NOT EXISTS "history_updated_at_idx" ON "history" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "history_created_at_idx" ON "history" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_fk" FOREIGN KEY ("history_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_history_id_idx" ON "payload_locked_documents_rels" USING btree ("history_id");
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_locations_address_geocoding_status";
  CREATE TYPE "public"."enum_locations_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_locations_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_locations_address_geocoding_status";
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_contacts_address_geocoding_status";
  CREATE TYPE "public"."enum_contacts_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_contacts_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_contacts_address_geocoding_status";`)
}
