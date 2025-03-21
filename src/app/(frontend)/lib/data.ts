export const addressData: Address[] = [
  { code: '31275', location: 'Los Angeles, CA' },
  { code: '36211', location: 'Austin, TX' },
  { code: '35719', location: 'Denver, CO' },
  { code: '35719', location: 'Boston, MA' },
  { code: '17389', location: 'Chicago, IL' },
  { code: '08280', location: 'Seattle, WA' },
  { code: '86165', location: 'San Francisco, CA' },
  { code: '57319', location: 'Miami, FL' },
  { code: '57319', location: 'Dallas, TX' },
  { code: '35080', location: 'New York, NY' },
  { code: '35080', location: 'Washington, D.C.' },
  { code: '55543', location: 'Houston, TX' },
]

export interface Address {
  code: string
  location: string
}
