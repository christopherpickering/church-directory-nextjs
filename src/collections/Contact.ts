import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { address } from './Address'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['firstName', 'lastName', 'email'],
  },
  access: {
    read: authenticated,
    update: authenticated,
    create: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'fullName',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.firstName && siblingData.lastName) {
              return `${siblingData.firstName} ${siblingData.lastName}`
            }
            return siblingData.fullName
          },
        ],
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      ...address(),
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      admin: {
        description: 'Location this contact is associated with',
      },
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Notes about the contact',
      },
    },
  ],
}
