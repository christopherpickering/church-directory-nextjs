import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SearchHeader() {
  return (
    <header className="bg-primary-dark text-primary border-b border-primary-dark/10">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">ADDRESS DIRECTORY</h1>
        <div className="flex items-center gap-2">
          <Input
            className="w-64 bg-primary-foreground text-primary-dark  dark:bg-primary-dark"
            placeholder="Search..."
          />
          <Button
            variant="secondary"
            size="icon"
            className="bg-primary-foreground text-primary-dark dark:bg-primary-dark"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
