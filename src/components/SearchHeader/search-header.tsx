import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Search } from '@/search/Component'

export default function SearchHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="border-primary-dark/10 border-b bg-primary-dark text-primary">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="font-bold text-2xl">ADDRESS DIRECTORY</h1>
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
              <ThemeSelector />
            </div>
          ) : (
            <>
              <Search />
              <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
                <ThemeSelector />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
