import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ALTER COLUMN "address_country" SET DEFAULT '188';
  ALTER TABLE "contacts" ALTER COLUMN "address_country" SET DEFAULT '188';
  ALTER TABLE "locations" ADD COLUMN "address_hide_from_map" boolean DEFAULT false;
  ALTER TABLE "contacts" ADD COLUMN "address_hide_from_map" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ALTER COLUMN "address_country" SET DEFAULT 'USA';
  ALTER TABLE "contacts" ALTER COLUMN "address_country" SET DEFAULT 'USA';
  ALTER TABLE "locations" DROP COLUMN IF EXISTS "address_hide_from_map";
  ALTER TABLE "contacts" DROP COLUMN IF EXISTS "address_hide_from_map";`)
}
