import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "history_changed_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "history_changed_fields" CASCADE;
  DROP TABLE "history" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_history_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_history_id_idx";
  ALTER TABLE "locations" ALTER COLUMN "address_phone" DROP NOT NULL;
  ALTER TABLE "contacts" ALTER COLUMN "address_phone" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "content" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_content" jsonb;
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
  DROP TYPE "public"."enum_history_change_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_history_entity_type" AS ENUM('location', 'contact');
  CREATE TYPE "public"."enum_history_change_type" AS ENUM('create', 'update', 'delete');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
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
  
  CREATE TABLE IF NOT EXISTS "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  ALTER TABLE "locations" ALTER COLUMN "address_phone" SET NOT NULL;
  ALTER TABLE "contacts" ALTER COLUMN "address_phone" SET NOT NULL;
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
  
  DO $$ BEGIN
   ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "history_changed_fields_order_idx" ON "history_changed_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "history_changed_fields_parent_id_idx" ON "history_changed_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "history_location_idx" ON "history" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "history_contact_idx" ON "history" USING btree ("contact_id");
  CREATE INDEX IF NOT EXISTS "history_updated_at_idx" ON "history" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "history_created_at_idx" ON "history" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_fk" FOREIGN KEY ("history_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_history_id_idx" ON "payload_locked_documents_rels" USING btree ("history_id");
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "content";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_content";
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_locations_address_geocoding_status";
  CREATE TYPE "public"."enum_locations_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  ALTER TABLE "public"."locations" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_locations_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_locations_address_geocoding_status";
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_contacts_address_geocoding_status";
  CREATE TYPE "public"."enum_contacts_address_geocoding_status" AS ENUM('not_geocoded', 'success', 'failed');
  ALTER TABLE "public"."contacts" ALTER COLUMN "address_geocoding_status" SET DATA TYPE "public"."enum_contacts_address_geocoding_status" USING "address_geocoding_status"::"public"."enum_contacts_address_geocoding_status";`)
}
