import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JSX } from "react/jsx-runtime"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLyrics(lyrics: string): JSX.Element {
  // Replace chord brackets with styled spans
  const formattedText = lyrics.split(/(\[[^\]]+\])/).map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      // This is a chord
      return (
        <span key={index} className="chord">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })

  return <>{formattedText}</>
}

