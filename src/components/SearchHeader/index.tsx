import { Search } from '@/search/Component'

export default function SearchHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="border-primary-dark/10 border-b bg-primary-dark text-primary">
      <div className=" mx-auto flex items-center justify-between py-4">
        <h1 className="font-bold text-2xl">ADDRESS DIRECTORY</h1>
        <div className="flex items-center gap-2">
          {isLoggedIn && <Search />}
        </div>
      </div>
    </header>
  )
}
