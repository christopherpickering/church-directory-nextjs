import Image from 'next/image'

export function Logo() {
  return (
    <Image
      alt="Payload Logo"
      height={30}
      className="invert dark:invert-0"
      src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
      width={150}
    />
  )
}
