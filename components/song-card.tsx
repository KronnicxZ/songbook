"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Music2, ExternalLink } from "lucide-react"
import type { Song } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

interface SongCardProps {
  song: Song
  onView: (song: Song) => void
  onEdit: (song: Song) => void
  onDelete: (song: Song) => void
}

export function SongCard({ song, onView, onEdit, onDelete }: SongCardProps) {
  const { user } = useAuth()

  return (
    <Card className="song-card h-full flex flex-col" onClick={() => onView(song)}>
      {user && (
        <div className="song-card-actions">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(song)
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(song)
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      )}

      <CardContent className="flex-1 pt-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Music2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-bold text-lg line-clamp-1">{song.title}</h3>
        <p className="text-muted-foreground line-clamp-1">{song.artist}</p>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-md bg-secondary">{song.key}</span>
          <span className="px-2 py-1 rounded-md bg-secondary">{song.bpm} BPM</span>
        </div>

        {song.youtubeUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              window.open(song.youtubeUrl, "_blank")
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Ver en YouTube</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

