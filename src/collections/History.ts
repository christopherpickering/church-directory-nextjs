import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const History: CollectionConfig = {
  slug: 'history',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'entityType', 'createdAt', 'createdBy'],
    description: 'Track changes to addresses, contacts, and meeting times',
  },
  access: {
    read: authenticated,
    update: authenticated,
    create: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Brief description of the change',
      },
    },
    {
      name: 'entityType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Location',
          value: 'location',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
      ],
    },
    {
      name: 'entityId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the entity that was changed',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      admin: {
        condition: (data) => data.entityType === 'location',
        description: 'Link to the location that was changed',
      },
    },
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'contacts',
      admin: {
        condition: (data) => data.entityType === 'contact',
        description: 'Link to the contact that was changed',
      },
    },
    {
      name: 'previousData',
      type: 'json',
      admin: {
        description: 'The data before the change',
      },
    },
    {
      name: 'newData',
      type: 'json',
      admin: {
        description: 'The data after the change',
      },
    },
    {
      name: 'changeType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Create',
          value: 'create',
        },
        {
          label: 'Update',
          value: 'update',
        },
        {
          label: 'Delete',
          value: 'delete',
        },
      ],
    },
    {
      name: 'changedFields',
      type: 'array',
      admin: {
        description: 'List of fields that were changed',
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          required: true,
        },
        {
          name: 'oldValue',
          type: 'text',
        },
        {
          name: 'newValue',
          type: 'text',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this change',
      },
    },
  ],
  timestamps: true,
}
