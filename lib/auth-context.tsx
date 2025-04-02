"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock database for users
interface StoredUser extends User {
  password: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Remove password from user object before setting to state
        const { password, ...userWithoutPassword } = parsedUser
        setUser(userWithoutPassword)
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }

    // Verificar si existe algún usuario en el sistema
    const users = getUsers()

    // Si no hay usuarios, crear el usuario predeterminado
    if (users.length === 0) {
      const defaultUser: StoredUser = {
        id: "user-default",
        name: "José Montilla",
        email: "montillajose221@gmail.com",
        password: "123456789",
      }

      // Guardar el usuario predeterminado
      saveUsers([defaultUser])
      console.log("Usuario predeterminado creado")
    }

    setIsLoading(false)
  }, [])

  // Helper to get users from localStorage
  const getUsers = (): StoredUser[] => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers)
      } catch (error) {
        console.error("Error parsing stored users:", error)
      }
    }
    return []
  }

  // Helper to save users to localStorage
  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("users", JSON.stringify(users))
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const users = getUsers()
      const foundUser = users.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        // Create a copy without the password
        const { password: _, ...userWithoutPassword } = foundUser

        setUser(userWithoutPassword)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const users = getUsers()

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return false
      }

      const newUser: StoredUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
      }

      // Save to "database"
      saveUsers([...users, newUser])

      // Create a copy without the password for state
      const { password: _, ...userWithoutPassword } = newUser

      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Register error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

