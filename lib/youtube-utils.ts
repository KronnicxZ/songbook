interface VideoInfo {
  title: string
  artist: string
  videoId: string
}

/**
 * Extracts video ID from a YouTube URL
 */
export function extractVideoId(url: string): string | null {
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Extracts artist and title from a YouTube video title
 * This is a simple implementation that assumes format: "Artist - Title"
 */
export function parseVideoTitle(title: string): { title: string } {
  // Clean up the title by removing common suffixes
  let cleanTitle = title
  const suffixesToRemove = [
    " (Official Video)",
    " (Official Music Video)",
    " (Lyric Video)",
    " (Audio)",
    " (Official Audio)",
    " (Visualizer)",
    " [Official Video]",
    " - Official Video",
    " | Official Video",
  ]

  for (const suffix of suffixesToRemove) {
    if (cleanTitle.includes(suffix)) {
      cleanTitle = cleanTitle.replace(suffix, "")
    }
  }

  return {
    title: cleanTitle.trim(),
  }
}

/**
 * Fetches video information from YouTube URL
 */
export async function extractVideoInfo(url: string): Promise<VideoInfo | null> {
  const videoId = extractVideoId(url)
  if (!videoId) return null

  try {
    // Use noembed.com to get video metadata
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    const data = await response.json()

    if (data.title) {
      const { title } = parseVideoTitle(data.title)

      // Use the author_name (channel name) as the artist
      const artist = data.author_name || ""

      return {
        videoId,
        title,
        artist,
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching video info:", error)
    return null
  }
}

