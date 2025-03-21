import { NavIconItem, NavItem } from '@/components/Nav/navigation'
import SearchHeader from '@/components/SearchHeader/search-header'
import { LogIn } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

interface LoginDashboardProps {
  children: React.ReactNode
}

export default function LoginDashboard({ children }: LoginDashboardProps) {
  const navItems = [
    { href: '/', icon: <LogIn className="h-5 w-5" />, label: 'Login' },
  ]
  const pathname = usePathname()
  const [activeRoute, setActiveRoute] = useState('/')

  // Update active route based on pathname
  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname)
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <SearchHeader isLoggedIn={false} />
      <nav className="border-primary-dark/50 border-t bg-primary-dark pb-10 text-primary-dark">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex w-full justify-between lg:hidden">
            {navItems.map((item) => (
              <NavIconItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={activeRoute === item.href}
                onClick={() => setActiveRoute(item.href)}
              />
            ))}
          </div>
          <div className="hidden lg:flex">
            <NavItem href="/" active={activeRoute === '/'}>
              Login
            </NavItem>
          </div>
        </div>
      </nav>
      <main className="container mx-auto flex-1">{children}</main>
    </div>
  )
}
