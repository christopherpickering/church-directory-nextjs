import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'

export const Person: CollectionConfig = {
  slug: 'person',
  admin: {
    useAsTitle: 'fullName',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'address',
      required: true,
    },
    {
      name: 'affiliatedChurch',
      type: 'relationship',
      relationTo: 'church',
      required: true,
      hasMany: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
    },
  ],
}
