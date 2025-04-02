import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Site Title',
      type: 'text',
      required: true,
      defaultValue: 'Address Directory',
    },
    {
      name: 'description',
      label: 'Site Description',
      type: 'textarea',
      required: true,
      defaultValue: 'A directory of addresses.',
    },
    {
      name: 'meta',
      label: 'SEO & Social',
      type: 'group',
      fields: [
        {
          name: 'defaultImage',
          label: 'Default Social Image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'favicon',
          label: 'Favicon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contact',
      label: 'Contact Information',
      type: 'group',
      fields: [
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
        },
      ],
    },
  ],
}
