"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Song } from "@/lib/types"
import { extractVideoInfo } from "@/lib/youtube-utils"
import { YouTubePreview } from "@/components/youtube-preview"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  artist: z.string().min(1, "El artista es requerido"),
  key: z.string().min(1, "La tonalidad es requerida"),
  bpm: z.coerce.number().min(1, "El BPM debe ser mayor a 0"),
  lyrics: z.string().min(1, "La letra es requerida"),
  youtubeUrl: z.string().optional(),
})

const KEYS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"]

interface SongFormProps {
  initialData?: Song
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function SongForm({ initialData, onSubmit, onCancel }: SongFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || "")
  const [showPreview, setShowPreview] = useState(!!initialData?.youtubeUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      artist: "",
      key: "",
      bpm: 120,
      lyrics: "",
      youtubeUrl: "",
    },
  })

  const handleYoutubeUrlChange = async (url: string) => {
    setYoutubeUrl(url)

    if (!url || url === initialData?.youtubeUrl) {
      setShowPreview(!!url)
      return
    }

    setIsLoading(true)
    try {
      const videoInfo = await extractVideoInfo(url)
      if (videoInfo) {
        // Only update fields if they're empty or if the user hasn't modified them
        if (!form.getValues("title") || form.getValues("title") === "") {
          form.setValue("title", videoInfo.title)
        }

        if (!form.getValues("artist") || form.getValues("artist") === "") {
          form.setValue("artist", videoInfo.artist)
        }

        setShowPreview(true)
      }
    } catch (error) {
      console.error("Error fetching video info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de YouTube (opcional)</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleYoutubeUrlChange(e.target.value)
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {isLoading && (
                    <Button variant="outline" disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cargando
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showPreview && youtubeUrl && (
          <div className="mt-4">
            <YouTubePreview url={youtubeUrl} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la canción" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artista</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del artista o banda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tonalidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tonalidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPM</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Beats por minuto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="lyrics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Letra con acordes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe la letra con acordes entre corchetes, por ejemplo: [C]Hola mundo"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground mt-2">
                Coloca los acordes entre corchetes, por ejemplo: [C] Hola [G]mundo
              </p>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Actualizar" : "Guardar"} Canción</Button>
        </div>
      </form>
    </Form>
  )
}

