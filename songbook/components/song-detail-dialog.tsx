"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Song } from "@/lib/types"
import { formatLyrics } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ExternalLink, Music2, Volume2, VolumeX } from "lucide-react"
import { extractVideoId } from "@/lib/youtube-utils"
import { useState } from "react"

interface SongDetailDialogProps {
  song: Song
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SongDetailDialog({ song, open, onOpenChange }: SongDetailDialogProps) {
  const videoId = song.youtubeUrl ? extractVideoId(song.youtubeUrl) : null
  const [isAudioMuted, setIsAudioMuted] = useState(true)
  const [audioMode, setAudioMode] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Music2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{song.title}</DialogTitle>
              <p className="text-muted-foreground">{song.artist}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 rounded-full bg-secondary text-sm">Tonalidad: {song.key}</div>
            <div className="px-3 py-1 rounded-full bg-secondary text-sm">BPM: {song.bpm}</div>

            {song.youtubeUrl && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => window.open(song.youtubeUrl, "_blank")}
              >
                Ver en YouTube
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Video/Audio primero */}
          {videoId && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{audioMode ? "Audio" : "Video"}</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAudioMode(!audioMode)}>
                    Cambiar a {audioMode ? "Video" : "Audio"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    title={isAudioMuted ? "Activar sonido" : "Silenciar"}
                  >
                    {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {audioMode ? (
                <div className="bg-card p-4 rounded-lg border flex items-center justify-center min-h-[200px]">
                  <div className="w-full max-w-md">
                    <div className="bg-primary/10 rounded-full p-6 mb-4 flex items-center justify-center">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                        <div className="absolute inset-2 rounded-full bg-primary/40"></div>
                        <div className="absolute inset-4 rounded-full bg-primary/60"></div>
                        <div className="absolute inset-6 rounded-full bg-primary"></div>
                      </div>
                    </div>

                    <iframe
                      width="100%"
                      height="0"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isAudioMuted ? 1 : 0}`}
                      title="YouTube audio player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      style={{ display: "none" }}
                    ></iframe>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {isAudioMuted ? "Haz clic en el botón de sonido para escuchar" : "Reproduciendo audio..."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=${isAudioMuted ? 1 : 0}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {/* Letra después */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Letra</h3>
            <div className="font-mono whitespace-pre-wrap bg-card p-4 rounded-lg border max-h-[400px] overflow-y-auto">
              {formatLyrics(song.lyrics)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

