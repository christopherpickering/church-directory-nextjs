'use client'
export default function SearchHeader({ title }: { title: string }) {
  return (
    <header className="border-primary-dark/10 border-b bg-primary-dark text-primary">
      <div className=" mx-auto flex items-center justify-between py-4">
        <h1 className="font-bold text-2xl">{title}</h1>
      </div>
    </header>
  )
}
