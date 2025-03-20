import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Search } from 'lucide-react'

export default function SearchHeader() {
  return (
    <header className="border-primary-dark/10 border-b bg-primary-dark text-primary">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="font-bold text-2xl">ADDRESS DIRECTORY</h1>
        <div className="flex items-center gap-2">
          <Input
            className="w-64 bg-primary-foreground text-primary-dark dark:bg-primary-dark"
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
          <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  )
}
