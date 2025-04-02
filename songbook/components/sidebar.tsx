"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Music,
  PlusCircle,
  Search,
  Menu,
  X,
  Home,
  Settings,
  ChevronLeft,
  LogOut,
  Heart,
  BookOpen,
  LogIn,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  onAddSong: () => void
  onLogin: () => void
}

export function Sidebar({ onAddSong, onLogin }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("home")

  // Handle window resize to auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        // On desktop, we start with the sidebar open
        setIsOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  // Define menu items based on authentication status
  const getMenuItems = () => {
    const items = [
      { id: "home", label: "Inicio", icon: Home },
      { id: "search", label: "Buscar", icon: Search },
    ]

    // Add items only available to authenticated users
    if (user) {
      items.push(
        { id: "add", label: "Agregar Canción", icon: PlusCircle, onClick: onAddSong },
        { id: "favorites", label: "Favoritos", icon: Heart },
        { id: "songbooks", label: "Cancioneros", icon: BookOpen },
        { id: "settings", label: "Configuración", icon: Settings },
      )
    } else {
      items.push({ id: "login", label: "Iniciar sesión", icon: LogIn, onClick: onLogin })
    }

    return items
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn("sidebar-overlay", { visible: isOpen && window.innerWidth < 768 })}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn("sidebar", {
          open: isOpen,
          collapsed: isCollapsed && window.innerWidth >= 768,
        })}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-6 w-6 text-primary sidebar-icon" />
              <span
                className={cn("font-bold text-lg sidebar-label", {
                  hidden: isCollapsed && window.innerWidth >= 768,
                })}
              >
                Cancionero
              </span>
            </div>

            {window.innerWidth < 768 ? (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden">
                <X className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
                <ChevronLeft
                  className={cn("h-5 w-5 transition-transform", {
                    "rotate-180": isCollapsed,
                  })}
                />
              </Button>
            )}
          </div>

          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div
                  className={cn("sidebar-label", {
                    hidden: isCollapsed && window.innerWidth >= 768,
                  })}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-2">
            <TooltipProvider delayDuration={0}>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id} className="sidebar-menu-item">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeItem === item.id ? "secondary" : "ghost"}
                          className={cn("w-full justify-start", {
                            "justify-center px-2": isCollapsed && window.innerWidth >= 768,
                          })}
                          onClick={() => {
                            setActiveItem(item.id)
                            if (item.onClick) item.onClick()
                            if (window.innerWidth < 768) setIsOpen(false)
                          }}
                        >
                          <item.icon
                            className={cn("h-5 w-5 sidebar-icon", {
                              "mr-2": !isCollapsed || window.innerWidth < 768,
                            })}
                          />

                          <span
                            className={cn("sidebar-label", {
                              hidden: isCollapsed && window.innerWidth >= 768,
                            })}
                          >
                            {item.label}
                          </span>
                        </Button>
                      </TooltipTrigger>

                      {isCollapsed && window.innerWidth >= 768 && (
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </TooltipProvider>
          </nav>

          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between">
              <ThemeToggle />

              {user && (
                <>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn({
                            hidden: !isCollapsed || window.innerWidth < 768,
                          })}
                          onClick={logout}
                        >
                          <LogOut className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>

                      {isCollapsed && window.innerWidth >= 768 && (
                        <TooltipContent side="right">Cerrar sesión</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-2", {
                      hidden: isCollapsed && window.innerWidth >= 768,
                    })}
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}

