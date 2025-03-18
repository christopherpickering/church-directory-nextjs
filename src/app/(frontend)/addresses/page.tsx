import React from 'react'
import DashboardLayout from '../components/dashboard-layout'
import ListView from '../components/list-view'
type Props = {}

const AddressesPage = (props: Props) => {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <ListView />
      </DashboardLayout>
    </div>
  )
}

export default AddressesPage
