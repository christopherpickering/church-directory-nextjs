import type { User } from '@/payload-types'

export const checkRole = (
  allRoles: User['role'],
  user: User | null | undefined,
): boolean => {
  if (user) {
    if (Array.isArray(allRoles)) {
      if (allRoles.length === 0) {
        return true
      }

      return allRoles.some((role) => {
        return user.role === role
      })
    }

    return user.role === allRoles
  }

  return false
}
