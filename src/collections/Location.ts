import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { address } from './Address'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: authenticated,
    update: authenticated,
    create: authenticated,
    delete: authenticated,
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
      admin: {
        description: 'Church notes',
      },
    },
    {
      name: 'schedule',
      type: 'richText',
    },
  ],
}
