"use client"

import { useState, useEffect } from "react"
import SongList from "@/components/song-list"
import { SearchBar } from "@/components/search-bar"
import { Sidebar } from "@/components/sidebar"
import { AddSongButton } from "@/components/add-song-button"
import { Button } from "@/components/ui/button"
import { Music, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { AuthDialog } from "@/components/auth-dialog"

export default function Home() {
  const { user } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [addSongOpen, setAddSongOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  // Handle window resize to update sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      } else {
        setIsSidebarCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleOpenAuthDialog = () => {
    setAuthDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onAddSong={() => setAddSongOpen(true)} onLogin={handleOpenAuthDialog} />

      <div
        className={cn("main-content", {
          collapsed: !isSidebarCollapsed && window.innerWidth >= 768,
        })}
      >
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Mi Cancionero Digital</h1>
              </div>
            </div>

            <div className="hidden md:block w-1/3">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <Button onClick={() => setAddSongOpen(true)} className="hidden sm:flex">
                  Agregar Canción
                </Button>
              ) : (
                <Button onClick={handleOpenAuthDialog} className="hidden sm:flex" variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="md:hidden py-4 px-4">
          <SearchBar />
        </div>

        <main className="container px-4 py-8">
          <SongList onLogin={handleOpenAuthDialog} />
        </main>
      </div>

      {user && <AddSongButton open={addSongOpen} onOpenChange={setAddSongOpen} />}

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}

