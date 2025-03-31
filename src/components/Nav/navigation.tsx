'use client'

import { Home, LogOut, MapPin, MessageCircle, PinIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [activeRoute, setActiveRoute] = useState('/')

  // Update active route based on pathname
  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname)
    }
  }, [pathname])

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    {
      href: '/addresses',
      label: 'Addresses',
      icon: <PinIcon className="h-5 w-5" />,
    },
    { href: '/map', label: 'Map', icon: <MapPin className="h-5 w-5" /> },
    { href: '/logout', label: 'Log out', icon: <LogOut className="h-5 w-5" /> },
  ]

  return (
    <nav className="border-primary-dark/50 border-t bg-primary-dark pb-10 text-primary-dark">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Mobile Navigation with Icons */}
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
          <NavIconItem
            href="/contact"
            icon={<MessageCircle className="h-5 w-5" />}
            label="Contact"
            active={activeRoute === '/contact'}
            onClick={() => setActiveRoute('/contact')}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex">
          <NavItem href="/" active={activeRoute === '/'}>
            Home
          </NavItem>
          <NavItem href="/addresses" active={activeRoute === '/addresses'}>
            Addresses
          </NavItem>
          <NavItem href="/history" active={activeRoute === '/history'}>
            History
          </NavItem>
          <NavItem href="/map" active={activeRoute === '/map'}>
            Map
          </NavItem>
          <NavItem href="/logout" active={activeRoute === '/logout'}>
            <span className="flex items-center gap-1">
              Log out <LogOut className="h-4 w-4" />
            </span>
          </NavItem>
        </div>
        <NavItem
          href="/contact"
          active={activeRoute === '/contact'}
          className="hidden lg:block"
        >
          Contact
        </NavItem>
      </div>
    </nav>
  )
}

interface NavItemProps {
  href: string
  children: React.ReactNode
  active?: boolean
  className?: string
}

export function NavItem({
  href,
  children,
  active = false,
  className = '',
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-3 font-medium text-sm transition-colors hover:bg-primary/50 ${
        active ? 'bg-primary/50 text-primary hover:bg-primary-dark/50' : ''
      } ${className}`}
    >
      {children}
    </Link>
  )
}

export interface NavIconItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  className?: string
  onClick?: () => void
}

export function NavIconItem({
  href,
  icon,
  label,
  active = false,
  className = '',
  onClick,
}: NavIconItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center px-3 py-3 font-medium text-sm transition-colors hover:bg-primary-dark/10 ${
        active ? 'bg-primary/50 text-primary hover:bg-primary-dark/50' : ''
      } ${className}`}
      onClick={onClick}
    >
      {icon}
      {active && (
        <span className="ml-1 xs:hidden text-primary sm:inline-block">
          {label}
        </span>
      )}
    </Link>
  )
}
