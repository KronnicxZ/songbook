"use client"

import { useState } from "react"
import type { Song } from "@/lib/types"
import { useSongs } from "@/lib/use-songs"
import { SongCard } from "@/components/song-card"
import { SongDetailDialog } from "@/components/song-detail-dialog"
import { EditSongDialog } from "@/components/edit-song-dialog"
import { DeleteSongDialog } from "@/components/delete-song-dialog"
import { Music, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface SongListProps {
  onLogin?: () => void
}

export default function SongList({ onLogin }: SongListProps) {
  const { user } = useAuth()
  const { songs, loading } = useSongs()
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [songToEdit, setSongToEdit] = useState<Song | null>(null)
  const [songToDelete, setSongToDelete] = useState<Song | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando canciones...</p>
        </div>
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border shadow-sm">
        <Music className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">No hay canciones</h3>
        <p className="text-muted-foreground">
          {user
            ? "Comienza agregando tu primera canción con el botón 'Agregar Canción'"
            : "Inicia sesión para agregar y gestionar canciones"}
        </p>
        {!user && onLogin && (
          <Button onClick={onLogin} className="mt-4" variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onView={() => setSelectedSong(song)}
            onEdit={() => setSongToEdit(song)}
            onDelete={() => setSongToDelete(song)}
          />
        ))}
      </div>

      {selectedSong && (
        <SongDetailDialog song={selectedSong} open={!!selectedSong} onOpenChange={() => setSelectedSong(null)} />
      )}

      {songToEdit && <EditSongDialog song={songToEdit} open={!!songToEdit} onOpenChange={() => setSongToEdit(null)} />}

      {songToDelete && (
        <DeleteSongDialog song={songToDelete} open={!!songToDelete} onOpenChange={() => setSongToDelete(null)} />
      )}
    </>
  )
}

