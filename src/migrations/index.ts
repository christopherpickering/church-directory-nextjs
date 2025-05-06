import * as migration_20250320_130809_initial_migration from './20250320_130809_initial_migration';
import * as migration_20250324_073034_added_address_as_a_field from './20250324_073034_added_address_as_a_field';
import * as migration_20250331_220639 from './20250331_220639';
import * as migration_20250401_182905_added_page_content__removed_globals from './20250401_182905_added_page_content__removed_globals';
import * as migration_20250402_160206 from './20250402_160206';
import * as migration_20250403_202746_added_receiveEmail_to_users from './20250403_202746_added_receiveEmail_to_users';
import * as migration_20250506_131617_added_countries_collection from './20250506_131617_added_countries_collection';
import * as migration_20250506_150251_added_hide_from_map_field_to_addresses from './20250506_150251_added_hide_from_map_field_to_addresses';

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
    name: '20250331_220639',
  },
  {
    up: migration_20250401_182905_added_page_content__removed_globals.up,
    down: migration_20250401_182905_added_page_content__removed_globals.down,
    name: '20250401_182905_added_page_content__removed_globals',
  },
  {
    up: migration_20250402_160206.up,
    down: migration_20250402_160206.down,
    name: '20250402_160206',
  },
  {
    up: migration_20250403_202746_added_receiveEmail_to_users.up,
    down: migration_20250403_202746_added_receiveEmail_to_users.down,
    name: '20250403_202746_added_receiveEmail_to_users',
  },
  {
    up: migration_20250506_131617_added_countries_collection.up,
    down: migration_20250506_131617_added_countries_collection.down,
    name: '20250506_131617_added_countries_collection',
  },
  {
    up: migration_20250506_150251_added_hide_from_map_field_to_addresses.up,
    down: migration_20250506_150251_added_hide_from_map_field_to_addresses.down,
    name: '20250506_150251_added_hide_from_map_field_to_addresses'
  },
];
