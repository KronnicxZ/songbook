"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SongForm } from "@/components/song-form"
import { useSongs } from "@/lib/use-songs"
import type { Song } from "@/lib/types"

interface EditSongDialogProps {
  song: Song
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSongDialog({ song, open, onOpenChange }: EditSongDialogProps) {
  const { updateSong } = useSongs()

  const handleSubmit = (data: any) => {
    updateSong(song.id, data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Canción</DialogTitle>
        </DialogHeader>
        <SongForm initialData={song} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

