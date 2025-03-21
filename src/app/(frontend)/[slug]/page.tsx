import AuthenticatedLayout from '../components/authenticated-layout'
import MapView from '../components/map-view'

export default function Page() {
  return (
    <article className="pt-16 pb-24">
      <AuthenticatedLayout>
        <MapView />
      </AuthenticatedLayout>
    </article>
  )
}
