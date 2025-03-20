'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import React, { useState } from 'react'

import { CreateAccount } from '@/components/CreateAccount'
import { Login } from '@/components/Login'
import { RecoverPassword } from '@/components/RecoverPassword'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import type { CarouselApi } from '@/components/ui/carousel'
import { useRouter } from 'next/navigation'
type Args = {
  slug?: string
}

export default function Modal({ slug }: Args) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }

    if (slug === 'login') api.scrollTo(0)
    if (slug === 'create-account') api.scrollTo(1)
    if (slug === 'recover-password') api.scrollTo(2)
  }, [api, slug])

  React.useEffect(() => {
    if (api && open) {
      api.reInit()
    }
  }, [open, api])

  return (
    <Dialog
      defaultOpen={open}
      open={open}
      onOpenChange={(open) => {
        if (open === false) router.back()
        setOpen(!open)
      }}
    >
      <DialogContent className="w-full max-w-sm p-0">
        <Carousel
          className="w-full max-w-sm p-6"
          opts={{
            watchDrag: false,
            watchFocus: false,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            <CarouselItem>
              <DialogTitle className="hidden">{'login.login'}</DialogTitle>
              <DialogDescription className="hidden">
                {'login.loginDescription'}
              </DialogDescription>
              <Login modal={true} slug={slug} />
            </CarouselItem>
            <CarouselItem>
              <DialogTitle className="hidden">
                {'createAccount.createAccount'}
              </DialogTitle>
              <DialogDescription className="hidden">
                {'createAccount.createAccountDescription'}
              </DialogDescription>
              <CreateAccount modal={true} slug={slug} />
            </CarouselItem>
            <CarouselItem>
              <DialogTitle className="hidden">
                {'recoverPassword.recoverPassword'}
              </DialogTitle>
              <DialogDescription className="hidden">
                {'recoverPassword.recoverPasswordDescription'}
              </DialogDescription>
              <RecoverPassword modal={true} slug={slug} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
