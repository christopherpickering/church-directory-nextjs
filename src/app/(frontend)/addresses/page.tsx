import AuthenticatedLayout from '../components/authenticated-layout'
import ListView from '../components/list-view'

export default function AddressesPage() {
  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <ListView />
      </AuthenticatedLayout>
    </div>
  )
}
