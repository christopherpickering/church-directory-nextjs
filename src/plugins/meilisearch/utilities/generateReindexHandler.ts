import {
  type CollectionSlug,
  type PayloadHandler,
  commitTransaction,
  initTransaction,
  killTransaction,
} from 'payload'

import { addLocalesToRequestFromData } from 'payload'

import { checkRole } from '@/access/checkRole'
import { MeiliSearch } from 'meilisearch'
import type { SearchPluginConfigWithLocales } from '../types'
import { buildDoc } from './buildDoc'

type ValidationResult = {
  isValid: boolean
  message?: string
}

export const generateReindexHandler =
  (pluginConfig: SearchPluginConfigWithLocales): PayloadHandler =>
  async (req) => {
    addLocalesToRequestFromData(req)
    const { collections = [] } = (await req.json?.()) as {
      collections: string[]
    }
    const t = req.t

    const client = new MeiliSearch({
      host: pluginConfig.host,
      apiKey: pluginConfig.apiKey,
    })

    const { collections: collectionsConfig } = pluginConfig

    const searchCollections = pluginConfig?.collections || []
    const reindexLocales = pluginConfig?.locales?.length
      ? pluginConfig.locales
      : [req.locale]

    if (!(req.user || checkRole('admin', req.user)))
      return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const validateCollections = (): ValidationResult => {
      const collectionsAreValid = collections.every((col) =>
        searchCollections.map((x) => x.slug).includes(col),
      )
      return collections.length && collectionsAreValid
        ? { isValid: true }
        : {
            isValid: false,
            message: t('error:invalidRequestArgs', { args: `'collections'` }),
          }
    }

    const { isValid: validCollections, message: collectionError } =
      validateCollections()
    if (!validCollections) {
      return Response.json({ message: collectionError }, { status: 400 })
    }

    const payload = req.payload
    const batchSize = pluginConfig.reindexBatchSize

    const defaultLocalApiProps = {
      overrideAccess: false,
      req,
      user: req.user,
    }
    const aggregateErrors = 0
    let aggregateDocs = 0

    const countDocuments = async (collection: string): Promise<number> => {
      const { totalDocs } = await payload.count({
        collection: collection as CollectionSlug,
        ...defaultLocalApiProps,
        req: undefined,
      })
      return totalDocs
    }

    const reindexCollection = async (collection: string) => {
      // remove old docs
      const index = client.index(collection)
      await index.deleteAllDocuments()

      const totalDocs = await countDocuments(collection)
      const totalBatches = Math.ceil(totalDocs / batchSize)
      aggregateDocs += totalDocs

      for (let j = 0; j < reindexLocales.length; j++) {
        const syncLocale = reindexLocales[j]

        const collectionConfig = collectionsConfig.filter(
          (x) => x.slug === collection,
        )[0]

        const { fields, excludedSlug = [] } = collectionConfig

        for (let i = 0; i < totalBatches; i++) {
          const { docs } = await payload.find({
            collection: collection as CollectionSlug,
            limit: batchSize,
            // @ts-ignore
            locale: syncLocale,
            page: i + 1,
            ...defaultLocalApiProps,
          })

          const fieldsConfig = payload.collections[
            collection
          ].config.flattenedFields.filter((x: { name: string }) =>
            fields.map((x) => x.name).includes(x.name),
          )

          const promises = docs
            //@ts-ignore
            .filter((x) => !excludedSlug.includes(x.slug))
            .flatMap((doc) =>
              buildDoc({
                req,
                doc,
                fieldsConfig,
                collection,
                fields,
                syncLocale,
              }),
            )
          await index.updateDocuments([...(await Promise.all(promises))])
        }
      }
    }

    await initTransaction(req)
    for (const collection of collections) {
      try {
        // await deleteIndexes(collection)
        await reindexCollection(collection)
      } catch (err) {
        const message = t('error:unableToReindexCollection', { collection })
        payload.logger.error({ err, msg: message })

        await killTransaction(req)
        return Response.json({ message }, { status: 500 })
      }
    }

    const message = t('general:successfullyReindexed', {
      collections: collections.join(', '),
      count: aggregateDocs - aggregateErrors,
      total: aggregateDocs,
    })

    await commitTransaction(req)

    return Response.json({ message }, { status: 200 })
  }
