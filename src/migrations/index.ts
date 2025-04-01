import * as migration_20250320_130809_initial_migration from './20250320_130809_initial_migration';
import * as migration_20250324_073034_added_address_as_a_field from './20250324_073034_added_address_as_a_field';
import * as migration_20250331_220639 from './20250331_220639';

export const migrations = [
  {
    up: migration_20250320_130809_initial_migration.up,
    down: migration_20250320_130809_initial_migration.down,
    name: '20250320_130809_initial_migration',
  },
  {
    up: migration_20250324_073034_added_address_as_a_field.up,
    down: migration_20250324_073034_added_address_as_a_field.down,
    name: '20250324_073034_added_address_as_a_field',
  },
  {
    up: migration_20250331_220639.up,
    down: migration_20250331_220639.down,
    name: '20250331_220639'
  },
];
