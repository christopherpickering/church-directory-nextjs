import { admins } from '@/access/admins'
import { checkRole } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['countryId', 'name'],
  },
  access: {
    admin: ({ req: { user } }) => {
      if (user) {
        return checkRole('admin', user)
      }
      return false
    },
    read: () => true,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'countryId',
      type: 'text',
      required: true,
      admin: {
        description: 'The ID from the original JSON file',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Country name',
      },
    },
  ],
}
