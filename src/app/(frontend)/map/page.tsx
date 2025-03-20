import DashboardLayout from '../components/dashboard-layout'
import MapView from '../components/map-view'

interface Props {
  readonly _?: never
}

const MapPage = (_props: Props) => {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <MapView />
      </DashboardLayout>
    </div>
  )
}

export default MapPage
