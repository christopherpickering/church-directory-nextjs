import { geocodeAddress } from './geocodeAddress'

export const afterChangeGeocodeAddress = async ({ doc, req, context }: any) => {
  if (context?.skipGeocodeHook) return doc

  if (doc.address) {
    const geocodedResult = await geocodeAddress(doc.address)
    await req.payload.update({
      collection: req.collection.config.slug,
      id: doc.id,
      data: {
        address: {
          ...doc.address,
          ...geocodedResult,
        },
      },
      context: { ...(context || {}), skipGeocodeHook: true },
      overrideAccess: true,
    })
  }
  return doc
}
