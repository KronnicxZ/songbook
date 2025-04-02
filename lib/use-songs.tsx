"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import type { Song } from "@/lib/types"

interface SongsContextType {
  songs: Song[]
  loading: boolean
  filter: string
  setFilter: (filter: string) => void
  addSong: (song: Omit<Song, "id" | "createdAt" | "updatedAt">) => void
  updateSong: (id: string, song: Omit<Song, "id" | "createdAt" | "updatedAt">) => void
  deleteSong: (id: string) => void
}

const SongsContext = createContext<SongsContextType | undefined>(undefined)

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  // Load songs from localStorage on initial render
  useEffect(() => {
    const storedSongs = localStorage.getItem("songs")
    if (storedSongs) {
      try {
        setSongs(JSON.parse(storedSongs))
      } catch (error) {
        console.error("Error parsing stored songs:", error)
      }
    }
    setLoading(false)
  }, [])

  // Save songs to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("songs", JSON.stringify(songs))
    }
  }, [songs, loading])

  // Filter songs based on search term
  useEffect(() => {
    if (!filter) {
      setFilteredSongs(songs)
      return
    }

    const lowerFilter = filter.toLowerCase()
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerFilter) ||
        song.artist.toLowerCase().includes(lowerFilter) ||
        song.key.toLowerCase().includes(lowerFilter),
    )

    setFilteredSongs(filtered)
  }, [songs, filter])

  const addSong = useCallback((songData: Omit<Song, "id" | "createdAt" | "updatedAt">) => {
    const newSong: Song = {
      ...songData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setSongs((prev) => [...prev, newSong])
  }, [])

  const updateSong = useCallback((id: string, songData: Omit<Song, "id" | "createdAt" | "updatedAt">) => {
    setSongs((prev) =>
      prev.map((song) =>
        song.id === id
          ? {
              ...song,
              ...songData,
              updatedAt: Date.now(),
            }
          : song,
      ),
    )
  }, [])

  const deleteSong = useCallback((id: string) => {
    setSongs((prev) => prev.filter((song) => song.id !== id))
  }, [])

  return (
    <SongsContext.Provider
      value={{
        songs: filteredSongs,
        loading,
        filter,
        setFilter,
        addSong,
        updateSong,
        deleteSong,
      }}
    >
      {children}
    </SongsContext.Provider>
  )
}

export function useSongs() {
  const context = useContext(SongsContext)
  if (context === undefined) {
    throw new Error("useSongs must be used within a SongsProvider")
  }
  return context
}

