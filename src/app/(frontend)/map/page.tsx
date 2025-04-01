import AuthenticatedLayout from '@/components/AuthLayout'
import { getAddresses } from '@/utilities/getAddresses'
import MapPageClient from './page.client'
export default async function MapPage() {
  const addresses = await getAddresses()

  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <MapPageClient addresses={addresses} />
      </AuthenticatedLayout>
    </div>
  )
}
