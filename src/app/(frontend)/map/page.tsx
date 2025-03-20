import DashboardLayout from '../components/dashboard-layout'

export default function MapPage() {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <div className="space-y-4">
          <h1 className="font-bold text-2xl">Placeholder Map</h1>
          <div className="rounded-md border">
            <div className="relative h-[300px] w-full overflow-hidden rounded-md sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=5.866699,47.270111,15.041504,55.128649&amp;layer=mapnik"
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                title="OpenStreetMap"
              />
            </div>
            <div className="bg-muted/50 p-2 text-center text-muted-foreground text-sm">
              The map is loaded from www.openstreetmap.org
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
