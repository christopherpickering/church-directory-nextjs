'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { History } from '@/payload-types'
import { formatDistance } from 'date-fns'
import { Calendar, Download, FileText } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const ITEMS_PER_PAGE = 10

function HistoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPage = Number(searchParams.get('page') || 1)

  const [history, setHistory] = useState<History[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/history?limit=${ITEMS_PER_PAGE}&page=${currentPage}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch history')
        }

        const data = await response.json()
        setHistory(data.docs)
        setTotalItems(data.totalDocs)
        setLoading(false)
      } catch (err) {
        setError('Error loading history data')
        setLoading(false)
        console.error('Error fetching history:', err)
      }
    }

    fetchHistory()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    router.push(`/history?page=${page}`)
  }

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/export-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: currentPage, limit: ITEMS_PER_PAGE }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Convert response to blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `history-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      console.error('Error exporting PDF:', err)
      alert('Failed to export history as PDF')
    }
  }

  // Format change type for display
  const formatChangeType = (type: string) => {
    switch (type) {
      case 'create':
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
            Created
          </span>
        )
      case 'update':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
            Updated
          </span>
        )
      case 'delete':
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs">
            Deleted
          </span>
        )
      default:
        return type
    }
  }

  // Format entity type for display
  const formatEntityType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight">History Log</h1>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-12 w-12 animate-spin rounded-full border-primary border-t-2 border-b-2" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border shadow">
            <Table>
              <TableCaption>History of changes in the directory</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Change Type</TableHead>
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center">
                      No history records found
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDistance(
                              new Date(item.createdAt),
                              new Date(),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{formatEntityType(item.entityType)}</TableCell>
                      <TableCell>{formatChangeType(item.changeType)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage <= 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1

                    // Show first page, last page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }

                    // Show ellipsis for skipped pages
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      disabled={currentPage >= totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </>
  )
}

// Loading fallback component for Suspense
function HistoryLoading() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-primary border-t-2 border-b-2" />
    </div>
  )
}

export default function HistoryPage() {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<HistoryLoading />}>
            <HistoryContent />
          </Suspense>
        </div>
      </DashboardLayout>
    </div>
  )
}
