/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji'

export interface Config {
  auth: {
    users: UserAuthOperations
  }
  blocks: {}
  collections: {
    pages: Page
    media: Media
    users: User
    locations: Location
    contacts: Contact
    'contact-submissions': ContactSubmission
    search: Search
    'payload-jobs': PayloadJob
    'payload-locked-documents': PayloadLockedDocument
    'payload-preferences': PayloadPreference
    'payload-migrations': PayloadMigration
  }
  collectionsJoins: {}
  collectionsSelect: {
    pages: PagesSelect<false> | PagesSelect<true>
    media: MediaSelect<false> | MediaSelect<true>
    users: UsersSelect<false> | UsersSelect<true>
    locations: LocationsSelect<false> | LocationsSelect<true>
    contacts: ContactsSelect<false> | ContactsSelect<true>
    'contact-submissions':
      | ContactSubmissionsSelect<false>
      | ContactSubmissionsSelect<true>
    search: SearchSelect<false> | SearchSelect<true>
    'payload-jobs': PayloadJobsSelect<false> | PayloadJobsSelect<true>
    'payload-locked-documents':
      | PayloadLockedDocumentsSelect<false>
      | PayloadLockedDocumentsSelect<true>
    'payload-preferences':
      | PayloadPreferencesSelect<false>
      | PayloadPreferencesSelect<true>
    'payload-migrations':
      | PayloadMigrationsSelect<false>
      | PayloadMigrationsSelect<true>
  }
  db: {
    defaultIDType: number
  }
  globals: {}
  globalsSelect: {}
  locale: null
  user: User & {
    collection: 'users'
  }
  jobs: {
    tasks: {
      schedulePublish: TaskSchedulePublish
      inline: {
        input: unknown
        output: unknown
      }
    }
    workflows: unknown
  }
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string
    password: string
  }
  login: {
    email: string
    password: string
  }
  registerFirstUser: {
    email: string
    password: string
  }
  unlock: {
    email: string
    password: string
  }
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: number
  title: string
  content?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  publishedAt?: string | null
  slug?: string | null
  slugLock?: boolean | null
  updatedAt: string
  createdAt: string
  _status?: ('draft' | 'published') | null
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number
  alt?: string | null
  caption?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  updatedAt: string
  createdAt: string
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  sizes?: {
    thumbnail?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    square?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    small?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    medium?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    large?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    xlarge?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    og?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
  }
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number
  name?: string | null
  role?: ('admin' | 'user') | null
  updatedAt: string
  createdAt: string
  email: string
  resetPasswordToken?: string | null
  resetPasswordExpiration?: string | null
  salt?: string | null
  hash?: string | null
  loginAttempts?: number | null
  lockUntil?: string | null
  password?: string | null
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "locations".
 */
export interface Location {
  id: number
  name: string
  /**
   * Church website URL
   */
  website?: string | null
  /**
   * Main contact email
   */
  email?: string | null
  /**
   * Main contact phone number
   */
  phoneNumber?: string | null
  address: {
    country?: string | null
    addressLine1: string
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    phone?: string | null
    /**
     * Automatically populated when address is saved
     */
    latitude?: number | null
    /**
     * Automatically populated when address is saved
     */
    longitude?: number | null
    geocodingStatus?:
      | ('not_geocoded' | 'geocoding' | 'geocoded' | 'failed')
      | null
    lastGeocodedAt?: string | null
  }
  notes?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  schedule?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "contacts".
 */
export interface Contact {
  id: number
  firstName: string
  lastName?: string | null
  fullName?: string | null
  email?: string | null
  phoneNumber?: string | null
  address: {
    country?: string | null
    addressLine1: string
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    phone?: string | null
    /**
     * Automatically populated when address is saved
     */
    latitude?: number | null
    /**
     * Automatically populated when address is saved
     */
    longitude?: number | null
    geocodingStatus?:
      | ('not_geocoded' | 'geocoding' | 'geocoded' | 'failed')
      | null
    lastGeocodedAt?: string | null
  }
  /**
   * Location this contact is associated with
   */
  location?: (number | null) | Location
  /**
   * Notes about the contact
   */
  notes?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  updatedAt: string
  createdAt: string
}
/**
 * Contact form submissions
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "contact-submissions".
 */
export interface ContactSubmission {
  id: number
  name: string
  email: string
  regarding?: string | null
  message: string
  status?: ('new' | 'inProgress' | 'resolved') | null
  /**
   * Admin notes about this submission
   */
  notes?: string | null
  updatedAt: string
  createdAt: string
}
/**
 * This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as documents in the CMS are created or updated.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "search".
 */
export interface Search {
  id: number
  title?: string | null
  priority?: number | null
  doc: {
    relationTo: 'pages'
    value: number | Page
  }
  slug?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: (number | null) | Media
  }
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-jobs".
 */
export interface PayloadJob {
  id: number
  /**
   * Input data provided to the job
   */
  input?:
    | {
        [k: string]: unknown
      }
    | unknown[]
    | string
    | number
    | boolean
    | null
  taskStatus?:
    | {
        [k: string]: unknown
      }
    | unknown[]
    | string
    | number
    | boolean
    | null
  completedAt?: string | null
  totalTried?: number | null
  /**
   * If hasError is true this job will not be retried
   */
  hasError?: boolean | null
  /**
   * If hasError is true, this is the error that caused it
   */
  error?:
    | {
        [k: string]: unknown
      }
    | unknown[]
    | string
    | number
    | boolean
    | null
  /**
   * Task execution log
   */
  log?:
    | {
        executedAt: string
        completedAt: string
        taskSlug: 'inline' | 'schedulePublish'
        taskID: string
        input?:
          | {
              [k: string]: unknown
            }
          | unknown[]
          | string
          | number
          | boolean
          | null
        output?:
          | {
              [k: string]: unknown
            }
          | unknown[]
          | string
          | number
          | boolean
          | null
        state: 'failed' | 'succeeded'
        error?:
          | {
              [k: string]: unknown
            }
          | unknown[]
          | string
          | number
          | boolean
          | null
        id?: string | null
      }[]
    | null
  taskSlug?: ('inline' | 'schedulePublish') | null
  queue?: string | null
  waitUntil?: string | null
  processing?: boolean | null
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number
  document?:
    | ({
        relationTo: 'pages'
        value: number | Page
      } | null)
    | ({
        relationTo: 'media'
        value: number | Media
      } | null)
    | ({
        relationTo: 'users'
        value: number | User
      } | null)
    | ({
        relationTo: 'locations'
        value: number | Location
      } | null)
    | ({
        relationTo: 'contacts'
        value: number | Contact
      } | null)
    | ({
        relationTo: 'contact-submissions'
        value: number | ContactSubmission
      } | null)
    | ({
        relationTo: 'search'
        value: number | Search
      } | null)
    | ({
        relationTo: 'payload-jobs'
        value: number | PayloadJob
      } | null)
  globalSlug?: string | null
  user: {
    relationTo: 'users'
    value: number | User
  }
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number
  user: {
    relationTo: 'users'
    value: number | User
  }
  key?: string | null
  value?:
    | {
        [k: string]: unknown
      }
    | unknown[]
    | string
    | number
    | boolean
    | null
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number
  name?: string | null
  batch?: number | null
  updatedAt: string
  createdAt: string
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  title?: T
  content?: T
  publishedAt?: T
  slug?: T
  slugLock?: T
  updatedAt?: T
  createdAt?: T
  _status?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T
  caption?: T
  updatedAt?: T
  createdAt?: T
  url?: T
  thumbnailURL?: T
  filename?: T
  mimeType?: T
  filesize?: T
  width?: T
  height?: T
  focalX?: T
  focalY?: T
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        square?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        small?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        medium?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        large?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        xlarge?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
        og?:
          | T
          | {
              url?: T
              width?: T
              height?: T
              mimeType?: T
              filesize?: T
              filename?: T
            }
      }
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T
  role?: T
  updatedAt?: T
  createdAt?: T
  email?: T
  resetPasswordToken?: T
  resetPasswordExpiration?: T
  salt?: T
  hash?: T
  loginAttempts?: T
  lockUntil?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "locations_select".
 */
export interface LocationsSelect<T extends boolean = true> {
  name?: T
  website?: T
  email?: T
  phoneNumber?: T
  address?:
    | T
    | {
        country?: T
        addressLine1?: T
        addressLine2?: T
        city?: T
        state?: T
        postalCode?: T
        phone?: T
        latitude?: T
        longitude?: T
        geocodingStatus?: T
        lastGeocodedAt?: T
      }
  notes?: T
  schedule?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "contacts_select".
 */
export interface ContactsSelect<T extends boolean = true> {
  firstName?: T
  lastName?: T
  fullName?: T
  email?: T
  phoneNumber?: T
  address?:
    | T
    | {
        country?: T
        addressLine1?: T
        addressLine2?: T
        city?: T
        state?: T
        postalCode?: T
        phone?: T
        latitude?: T
        longitude?: T
        geocodingStatus?: T
        lastGeocodedAt?: T
      }
  location?: T
  notes?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "contact-submissions_select".
 */
export interface ContactSubmissionsSelect<T extends boolean = true> {
  name?: T
  email?: T
  regarding?: T
  message?: T
  status?: T
  notes?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "search_select".
 */
export interface SearchSelect<T extends boolean = true> {
  title?: T
  priority?: T
  doc?: T
  slug?: T
  meta?:
    | T
    | {
        title?: T
        description?: T
        image?: T
      }
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-jobs_select".
 */
export interface PayloadJobsSelect<T extends boolean = true> {
  input?: T
  taskStatus?: T
  completedAt?: T
  totalTried?: T
  hasError?: T
  error?: T
  log?:
    | T
    | {
        executedAt?: T
        completedAt?: T
        taskSlug?: T
        taskID?: T
        input?: T
        output?: T
        state?: T
        error?: T
        id?: T
      }
  taskSlug?: T
  queue?: T
  waitUntil?: T
  processing?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T
  globalSlug?: T
  user?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T
  key?: T
  value?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T
  batch?: T
  updatedAt?: T
  createdAt?: T
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "TaskSchedulePublish".
 */
export interface TaskSchedulePublish {
  input: {
    type?: ('publish' | 'unpublish') | null
    locale?: string | null
    doc?: {
      relationTo: 'pages'
      value: number | Page
    } | null
    global?: string | null
    user?: (number | null) | User
  }
  output?: unknown
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown
}

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
