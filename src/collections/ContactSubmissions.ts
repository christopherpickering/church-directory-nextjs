import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'
import { checkRole } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    description: 'Contact form submissions',
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
    create: anyone,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'regarding',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'In Progress',
          value: 'inProgress',
        },
        {
          label: 'Resolved',
          value: 'resolved',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Admin notes about this submission',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          const adminUsers = await req.payload.find({
            collection: 'users',
            where: {
              and: [
                { role: { equals: 'admin' } },
                { receiveEmail: { equals: true } },
              ],
            },
          })

          if (adminUsers?.docs?.length > 0) {
            for (const admin of adminUsers.docs) {
              await req.payload.sendEmail({
                to: admin.email,
                subject: 'New Contact Submission',
                text: `A new contact submission has been received from ${doc.name}. Message: ${doc.message}`,
              })
            }
          }
        }
      },
    ],
  },
  timestamps: true,
}
