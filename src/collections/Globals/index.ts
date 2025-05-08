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
      defaultValue: 'A directory of churches and correspondants.',
    },
  ],
}
