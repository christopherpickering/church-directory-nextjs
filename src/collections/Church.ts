import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'

export const Church: CollectionConfig = {
  slug: 'church',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Church Name',
    },
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'address',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
  ],
}
