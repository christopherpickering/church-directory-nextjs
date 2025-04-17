'use client'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ArrowLeft } from 'lucide-react'
import type React from 'react'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'

export function AddressSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(false)
        router.back()
      }}
    >
      <SheetContent className="w-full" hideCloseButton={true}>
        <div className="mb-8">
          <Button
            variant={'link'}
            onClick={() => router.back()}
            className="inline-flex items-center pt-10 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to addresses
          </Button>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  )
}
