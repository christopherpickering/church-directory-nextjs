import ListView from '@/components/ListView/list-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin } from 'lucide-react'

export default function MapView() {
  return (
    <Tabs defaultValue="map" className="w-full">
      <TabsList className="mb-4 w-full sm:w-auto">
        <TabsTrigger value="map" className="flex-1 sm:flex-none">
          <MapPin className="mr-2 h-4 w-4" />
          Map
        </TabsTrigger>
        <TabsTrigger value="list" className="flex-1 sm:flex-none">
          List
        </TabsTrigger>
      </TabsList>
      <TabsContent value="map" className="space-y-4">
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
      </TabsContent>
      <TabsContent value="list">
        <ListView />
      </TabsContent>
    </Tabs>
  )
}
