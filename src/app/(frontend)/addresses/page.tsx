import DashboardLayout from '../components/dashboard-layout'
import ListView from '../components/list-view'

export default function AddressesPage() {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <ListView />
      </DashboardLayout>
    </div>
  )
}
