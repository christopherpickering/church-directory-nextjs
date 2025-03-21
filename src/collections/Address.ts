import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'

export const Address: CollectionConfig = {
  slug: 'address',
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
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'addressLine1',
      type: 'text',
      required: true,
      label: 'Street Address',
    },
    {
      name: 'addressLine2',
      type: 'text',
      required: false,
      label: 'Apt, Suite, etc. (optional)',
    },
    {
      name: 'city',
      type: 'text',
      required: false,
    },
    {
      name: 'state',
      type: 'text',
      required: false,
    },
    {
      name: 'postalCode',
      type: 'text',
      required: false,
      label: 'Postal / ZIP Code',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
  ],
}
