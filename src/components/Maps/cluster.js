import { createPathComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet.markercluster'

function createMarkerCluster({ children: _c, ...props }, context) {
  const clusterProps = {}
  const clusterEvents = {}
  // Splitting props and events to different objects
  for (const [propName, prop] of Object.entries(props)) {
    if (propName.startsWith('on')) {
      clusterEvents[propName] = prop
    } else {
      clusterProps[propName] = prop
    }
  }
  const instance = new L.MarkerClusterGroup(clusterProps)

  // Initializing event listeners
  for (const [eventAsProp, callback] of Object.entries(clusterEvents)) {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
    instance.on(clusterEvent, callback)
  }
  return {
    instance,
    context: {
      ...context,
      layerContainer: instance,
    },
  }
}

const MarkerCluster = createPathComponent(createMarkerCluster)

export default MarkerCluster
