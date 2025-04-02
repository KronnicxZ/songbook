import type React from "react"
import { SongsProvider } from "@/lib/use-songs"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body>
        <AuthProvider>
          <SongsProvider>
            {children}
            <Toaster />
          </SongsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
