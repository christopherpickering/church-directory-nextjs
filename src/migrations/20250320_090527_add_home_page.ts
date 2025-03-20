import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "pages" (
      "title",
      "published_at",
      "slug",
      "slug_lock",
      "_status"
    ) VALUES (
      'Home',
      NOW(),
      'home',
      true,
      'published'
    );
  `)
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "pages" WHERE "slug" = 'home';
  `)
}
