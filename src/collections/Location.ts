import { admins } from '@/access/admins'
import { checkRole } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'
import { address } from './Address'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    admin: ({ req: { user } }) => {
      if (user) {
        return checkRole('admin', user)
      }
      return false
    },
    read: admins,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Church website URL',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Main contact email',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      admin: {
        description: 'Main contact phone number',
      },
    },
    {
      ...address(),
    },
    {
      name: 'notes',
      type: 'richText',
    },
    {
      name: 'schedule',
      type: 'richText',
    },
  ],
}
