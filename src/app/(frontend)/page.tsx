import DashboardLayout from './components/dashboard-layout'
import MapView from './components/map-view'

export default async function Page() {
  return (
    <article className="pt-16 pb-24">
      <DashboardLayout>
        <MapView />
      </DashboardLayout>
    </article>
  )
}
