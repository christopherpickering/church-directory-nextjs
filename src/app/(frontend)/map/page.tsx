import DashboardLayout from '@/components/DashboardLayout'
import { getAddresses } from '@/utilities/getAddresses'
import MapPageClient from './page.client'
export default async function MapPage() {
  const addresses = await getAddresses()

  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <div className="space-y-4">
          <MapPageClient addresses={addresses} />
        </div>
      </DashboardLayout>
    </div>
  )
}
