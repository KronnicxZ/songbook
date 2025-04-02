"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SongForm } from "@/components/song-form"
import { useSongs } from "@/lib/use-songs"

interface AddSongButtonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSongButton({ open, onOpenChange }: AddSongButtonProps) {
  const { addSong } = useSongs()

  const handleSubmit = (data: any) => {
    addSong(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Canción</DialogTitle>
        </DialogHeader>
        <SongForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

