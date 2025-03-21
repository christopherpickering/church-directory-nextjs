import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "church" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address_id" integer NOT NULL,
  	"email" varchar NOT NULL,
  	"website" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "address" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"address_line1" varchar NOT NULL,
  	"address_line2" varchar,
  	"city" varchar,
  	"state" varchar,
  	"postal_code" varchar,
  	"phone" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "person" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"address_id" integer NOT NULL,
  	"affiliated_church_id" integer NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "church_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "address_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "person_id" integer;
  DO $$ BEGIN
   ALTER TABLE "church" ADD CONSTRAINT "church_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "person" ADD CONSTRAINT "person_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "person" ADD CONSTRAINT "person_affiliated_church_id_church_id_fk" FOREIGN KEY ("affiliated_church_id") REFERENCES "public"."church"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "church_address_idx" ON "church" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "church_updated_at_idx" ON "church" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "church_created_at_idx" ON "church" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "address_updated_at_idx" ON "address" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "address_created_at_idx" ON "address" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "person_address_idx" ON "person" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "person_affiliated_church_idx" ON "person" USING btree ("affiliated_church_id");
  CREATE INDEX IF NOT EXISTS "person_updated_at_idx" ON "person" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "person_created_at_idx" ON "person" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_church_fk" FOREIGN KEY ("church_id") REFERENCES "public"."church"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_address_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_person_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_church_id_idx" ON "payload_locked_documents_rels" USING btree ("church_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_address_id_idx" ON "payload_locked_documents_rels" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_person_id_idx" ON "payload_locked_documents_rels" USING btree ("person_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "church" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "address" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "person" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "church" CASCADE;
  DROP TABLE "address" CASCADE;
  DROP TABLE "person" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_church_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_address_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_person_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_church_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_address_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_person_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "church_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "address_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "person_id";`)
}
