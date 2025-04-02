"use client"

import { useState, useEffect } from "react"
import { extractVideoId } from "@/lib/youtube-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface YouTubePreviewProps {
  url: string
}

export function YouTubePreview({ url }: YouTubePreviewProps) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isAudioMuted, setIsAudioMuted] = useState(true)

  useEffect(() => {
    const id = extractVideoId(url)
    setVideoId(id)
  }, [url])

  if (!videoId) return null

  return (
    <div className="rounded-lg overflow-hidden border bg-card">
      <Tabs defaultValue="video" className="w-full">
        <div className="flex items-center justify-between px-4 pt-2">
          <TabsList>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? "Activar sonido" : "Silenciar"}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <TabsContent value="video" className="mt-0">
          <div className="aspect-video">
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
        </TabsContent>

        <TabsContent value="audio" className="mt-0">
          <div className="p-4 flex items-center justify-center min-h-[200px]">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

