import { getAddresses } from '@/utilities/getAddresses'
import MapClientComponent from './MapClientComponent'

export default async function HomeMap() {
  const addresses = await getAddresses()
  const addressesToShow = addresses.filter((address) => !address.hideFromMap)

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="w-full">
        <MapClientComponent addresses={addressesToShow} />
      </div>
    </div>
  )
}
