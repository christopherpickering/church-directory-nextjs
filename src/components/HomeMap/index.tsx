import { getAddresses } from '@/utilities/getAddresses'
import MapClientComponent from './MapClientComponent'

export default async function HomeMap() {
  const addresses = await getAddresses()

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="w-full">
        <MapClientComponent addresses={addresses} />
      </div>
    </div>
  )
}
