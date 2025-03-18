import React from 'react'
import DashboardLayout from '../components/dashboard-layout'
import MapView from '../components/map-view'

type Props = {}

const MapPage = (props: Props) => {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <MapView />
      </DashboardLayout>
    </div>
  )
}

export default MapPage
