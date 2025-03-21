import * as migration_20250320_130809_initial_migration from './20250320_130809_initial_migration';
import * as migration_20250321_124740_added_collections from './20250321_124740_added_collections';

export const migrations = [
  {
    up: migration_20250320_130809_initial_migration.up,
    down: migration_20250320_130809_initial_migration.down,
    name: '20250320_130809_initial_migration',
  },
  {
    up: migration_20250321_124740_added_collections.up,
    down: migration_20250321_124740_added_collections.down,
    name: '20250321_124740_added_collections'
  },
];
