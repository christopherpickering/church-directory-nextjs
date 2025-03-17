'use client'

import {
  LoadingOverlay,
  toast,
  useLocale,
  useModal,
  useTranslation,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useCallback, useState } from 'react'

// import { ReindexButtonLabel } from './ReindexButtonLabel'
import { ReindexConfirmModal } from './ReindexConfirmModal'
import type { ViewClientProps } from './types'

const confirmReindexModalSlug = 'confirm-reindex-modal'

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export const ViewClient: React.FC<ViewClientProps> = ({
  searchCollections,
  stats,
  health,
  version,
}) => {
  const { closeModal, openModal } = useModal()

  const {
    i18n: { t },
  } = useTranslation()
  const locale = useLocale()
  const router = useRouter()

  const [reindexCollections, setReindexCollections] = useState<string[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  const openConfirmModal = useCallback(
    () => openModal(confirmReindexModalSlug),
    [openModal],
  )
  const closeConfirmModal = useCallback(
    () => closeModal(confirmReindexModalSlug),
    [closeModal],
  )

  const handleReindexSubmit = useCallback(async () => {
    if (isLoading || !reindexCollections.length) {
      return
    }

    closeConfirmModal()
    setLoading(true)

    try {
      const endpointRes = await fetch(
        `/api/search/reindex?locale=${locale.code}`,
        {
          body: JSON.stringify({
            collections: reindexCollections,
          }),
          method: 'POST',
        },
      )

      const { message } = (await endpointRes.json()) as { message: string }

      if (!endpointRes.ok) {
        toast.error(message)
      } else {
        toast.success(message)
        router.refresh()
      }
    } catch (_err: unknown) {
      // swallow error, toast shown above
    } finally {
      setReindexCollections([])
      setLoading(false)
    }
  }, [closeConfirmModal, isLoading, reindexCollections, router, locale])

  const handleShowConfirmModal = useCallback(
    (collections: string | string[] = searchCollections) => {
      setReindexCollections(
        typeof collections === 'string' ? [collections] : collections,
      )
      openConfirmModal()
    },
    [openConfirmModal, searchCollections],
  )

  const handlePopupButtonClick = useCallback(
    (closePopup: () => void, slug?: string) => {
      closePopup()
      handleShowConfirmModal(slug)
    },
    [handleShowConfirmModal],
  )

  const selectedAll = reindexCollections.length === searchCollections.length
  const selectedLabels = reindexCollections
    .map((slug) => slug) //pluralizedLabels[slug])
    .join(', ')

  const modalTitle = selectedAll
    ? t('general:confirmReindexAll')
    : t('general:confirmReindex', { collections: selectedLabels })
  const modalDescription = selectedAll
    ? t('general:confirmReindexDescriptionAll')
    : t('general:confirmReindexDescription', { collections: selectedLabels })
  const loadingText = selectedAll
    ? t('general:reindexingAll', { collections: t('general:collections') })
    : t('general:reindexingAll', { collections: selectedLabels })

  return (
    <div className="dashboard">
      <div className="gutter--left gutter--right dashboard__wrap">
        <div className="dahsboard_group">
          <h2 className="dashboard_label">Search</h2>
          <div>
            Manage Meilisearch Indexes.{' '}
            <button
              type="button"
              className="btn"
              onClick={() => handlePopupButtonClick(close)}
            >
              Reindex all collections.
            </button>
          </div>

          <p style={{ marginBottom: '1rem' }}>
            <span
              style={{
                borderRadius: '999px',
                backgroundColor: `${health?.status === 'available' ? 'green' : 'red'}`,
                width: '0.6rem',
                height: '0.6rem',
                display: 'inline-block',
                marginBottom: '1px',
                marginRight: '3px',
              }}
            />
            Meilisearch{' '}
            {version?.pkgVersion && <strong>{version.pkgVersion}</strong>}{' '}
            database is currently{' '}
            <strong>{formatBytes(stats.databaseSize)}</strong>.
          </p>

          <ul className="dashboard__card-list">
            {searchCollections.map((collectionSlug) => (
              <li key={collectionSlug}>
                <div
                  className="card card-forms"
                  id="card-forms"
                  style={{ flexDirection: 'column' }}
                >
                  <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <h3 className="card__title">
                      <a href={`/admin/collections/${collectionSlug}`}>
                        {collectionSlug}
                      </a>
                    </h3>
                    <div className="card__actions">
                      <button
                        type="button"
                        aria-label="Reindex"
                        className="btn btn--icon btn--icon-style-with-border btn--icon-only btn--size-medium btn--icon-position-right btn--withoutPopup btn--style-icon-label btn--round btn--withoutPopup"
                        onClick={() =>
                          handlePopupButtonClick(close, collectionSlug)
                        }
                      >
                        <span className="btn__content">
                          <span className="btn__icon">
                            <svg
                              className="icon"
                              style={{
                                padding: '3px',
                                marginTop: '-3px',
                                marginLeft: '-1px',
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <title>reload</title>
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                              <path d="M21 3v5h-5" />
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                              <path d="M8 16H3v5" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    Contains{' '}
                    <strong>
                      {stats.indexes[collectionSlug].numberOfDocuments}
                    </strong>{' '}
                    document(s).
                  </div>
                </div>
              </li>
            ))}

            <ReindexConfirmModal
              description={modalDescription}
              onCancel={closeConfirmModal}
              onConfirm={handleReindexSubmit}
              slug={confirmReindexModalSlug}
              title={modalTitle}
            />
            {isLoading && <LoadingOverlay loadingText={loadingText} />}
          </ul>
        </div>
      </div>
    </div>
  )
}
