import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'

type AddressType = (options?: { overrides?: Record<string, unknown> }) => Field

export const address: AddressType = ({ overrides = {} } = {}) => {
  const addressResult: Field = {
    name: 'address',
    type: 'group',
    fields: [
      {
        name: 'country',
        type: 'text',
        defaultValue: 'USA',
      },
      {
        name: 'addressLine1',
        type: 'text',
        required: true,
      },
      {
        name: 'addressLine2',
        type: 'text',
        required: false,
      },
      {
        name: 'postalCode',
        type: 'text',
        required: false,
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
        name: 'phone',
        type: 'text',
        required: true,
      },
      {
        name: 'latitude',
        type: 'number',
        admin: {
          description: 'Automatically populated when address is saved',
          readOnly: true,
          position: 'sidebar',
        },
      },
      {
        name: 'longitude',
        type: 'number',
        admin: {
          description: 'Automatically populated when address is saved',
          readOnly: true,
          position: 'sidebar',
        },
      },
      {
        name: 'geocodingStatus',
        type: 'select',
        admin: {
          position: 'sidebar',
          readOnly: true,
        },
        options: [
          {
            label: 'Not Geocoded',
            value: 'not_geocoded',
          },
          {
            label: 'Geocoding',
            value: 'geocoding',
          },
          {
            label: 'Geocoded',
            value: 'geocoded',
          },
          {
            label: 'Failed',
            value: 'failed',
          },
        ],
        defaultValue: 'not_geocoded',
      },
      {
        name: 'lastGeocodedAt',
        type: 'date',
        admin: {
          position: 'sidebar',
          readOnly: true,
          date: {
            pickerAppearance: 'dayAndTime',
          },
        },
      },
    ],
  }
  return deepMerge(addressResult, overrides)
}
