import { admins } from '@/access/admins'
import { checkRole } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'
import { address } from './Address'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['firstName', 'lastName', 'email'],
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
