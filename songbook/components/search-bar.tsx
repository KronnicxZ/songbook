"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useSongs } from "@/lib/use-songs"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const { setFilter } = useSongs()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilter(searchTerm)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, setFilter])

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por título, artista o tonalidad..."
        className="pl-10 bg-card"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

