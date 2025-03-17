export const buildDoc = async ({
  req,
  doc,
  fieldsConfig,
  collection,
  fields,
  syncLocale,
}) => {
  // need to relookup doc to get related fields

  const refreshedDoc = await req.payload.findByID({
    id: doc.id,
    collection,
    locale: syncLocale,
    depth: 1000,
    req,
  })

  return {
    id: doc.id,
    doc: {
      relationTo: collection,
      value: doc.id,
      slug: doc.slug,
    },
    ...Object.fromEntries(
      await Promise.all(
        fieldsConfig.map(async ({ name }) => {
          const field = fields.filter((x) => x.name === name)[0]

          const callback = field.transformer
          const value = callback
            ? await callback(refreshedDoc[name])
            : refreshedDoc[name]

          const key = field.alias || field.name

          if (field.localized) return [`${key}_${syncLocale}`, value]
          return [key, value]
        }),
      ),
    ),
  }
}

export const buildHit = async ({ doc, locale, payload }) => {
  const nd = await payload.findByID({
    collection: doc.doc.relationTo,
    id: doc.doc.value,
    locale,
    select: {
      meta: true,
      slug: true,
      title: true,
    },
  })

  return { ...doc, doc: { ...nd, relationTo: doc.doc.relationTo } }
}
