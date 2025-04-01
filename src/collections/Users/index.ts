import { admins } from '@/access/admins'
import { adminsAndUser } from '@/access/adminsAndUser'
import { checkRole } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      if (user) {
        return checkRole('admin', user)
      }
      return false
    },
    create: admins,
    delete: admins,
    read: adminsAndUser,
    update: admins,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
    },
  ],
  timestamps: true,
}
