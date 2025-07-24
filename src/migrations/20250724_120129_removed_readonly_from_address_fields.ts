import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_meta_default_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_meta_favicon_id_media_id_fk";
  
  DROP INDEX IF EXISTS "site_settings_meta_meta_default_image_idx";
  DROP INDEX IF EXISTS "site_settings_meta_meta_favicon_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "description" SET DEFAULT 'A directory of churches and correspondants.';
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "meta_default_image_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "meta_favicon_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "contact_email";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "contact_phone";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "description" SET DEFAULT 'A directory of addresses.';
  ALTER TABLE "site_settings" ADD COLUMN "meta_default_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "meta_favicon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_phone" varchar;
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_default_image_id_media_id_fk" FOREIGN KEY ("meta_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_favicon_id_media_id_fk" FOREIGN KEY ("meta_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "site_settings_meta_meta_default_image_idx" ON "site_settings" USING btree ("meta_default_image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_meta_meta_favicon_idx" ON "site_settings" USING btree ("meta_favicon_id");`)
}
