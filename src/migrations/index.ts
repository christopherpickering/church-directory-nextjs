import * as migration_20250320_082349_initial_migration from './20250320_082349_initial_migration';
import * as migration_20250320_090527_add_home_page from './20250320_090527_add_home_page';

export const migrations = [
  {
    up: migration_20250320_082349_initial_migration.up,
    down: migration_20250320_082349_initial_migration.down,
    name: '20250320_082349_initial_migration',
  },
  {
    up: migration_20250320_090527_add_home_page.up,
    down: migration_20250320_090527_add_home_page.down,
    name: '20250320_090527_add_home_page'
  },
];
