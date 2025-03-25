import AddressSearch from '@/components/AddressSearch'
import AuthenticatedLayout from '@/components/AuthLayout'

export default function SlugPage() {
  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <div className="mx-auto max-w-4xl space-y-8 px-4">
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>
                This directory contains congregations in{' '}
                <span className="font-bold">Location</span> known to gather
                solely in the name of the Lord Jesus and to seek to realize the
                unity of the Spirit. This directory is intended as a guide and
                is not intended to define any particular group.
              </p>
              <p>
                Publishing the directory online eliminates the time-consuming
                task of maintaining a separate directory. Those who still want
                to maintain a paper directory can view the changes under
                &quot;History,&quot; which can then be transferred to the paper
                version.
              </p>
              <p className="font-medium">
                Please treat all data strictly confidential!
              </p>
            </div>
          </div>

          {/* Search and Map Section */}
          <div className="flex flex-col items-center space-y-8 md:space-y-12">
            {/* Search Section */}
            <div className="w-full max-w-2xl space-y-4">
              <h2 className="text-center font-semibold text-2xl">
                Search address
              </h2>
              <AddressSearch />
            </div>

            {/* Map Button */}
            <div className="w-full max-w-2xl">
              <a
                href="/map"
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-primary-foreground hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary sm:flex-row"
              >
                <span>Open map (Location)</span>
                <span className="text-gray-200 text-sm">
                  The map is loaded from www.openstreetmap.org
                </span>
              </a>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  )
}
