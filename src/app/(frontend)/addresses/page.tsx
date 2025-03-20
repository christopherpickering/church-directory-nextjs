import DashboardLayout from '../components/dashboard-layout'
import ListView from '../components/list-view'

interface Props {
  readonly _?: never
}

const AddressesPage = (_props: Props) => {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <ListView />
      </DashboardLayout>
    </div>
  )
}

export default AddressesPage
