'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ConvexReactClient, useQuery, useMutation } from 'convex/react'
import { ConvexProvider as BaseConvexProvider } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Id } from '../convex/_generated/dataModel'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder.convex.cloud'
const convex = new ConvexReactClient(convexUrl)

type User = {
  _id: Id<"users">
  email: string
  role: 'child' | 'parent'
  username?: string
  avatarUrl?: string
  bio?: string
  createdAt: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role: 'child' | 'parent') => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: () => {},
})

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loginMutation = useMutation(api.auth.login)
  const registerMutation = useMutation(api.auth.register)
  const logoutMutation = useMutation(api.auth.logout)

  const user = useQuery(api.auth.getCurrentUser, token ? { token } : "skip") as User | null | undefined

  useEffect(() => {
    const storedToken = localStorage.getItem('elise_token')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user === null && token) {
      localStorage.removeItem('elise_token')
      setToken(null)
    }
  }, [user, token])

  const login = async (email: string, password: string) => {
    const result = await loginMutation({ email, password })
    localStorage.setItem('elise_token', result.token)
    setToken(result.token)
  }

  const register = async (email: string, password: string, role: 'child' | 'parent') => {
    const result = await registerMutation({ email, password, role })
    localStorage.setItem('elise_token', result.token)
    setToken(result.token)
  }

  const logout = async () => {
    if (token) {
      await logoutMutation({ token })
    }
    localStorage.removeItem('elise_token')
    setToken(null)
  }

  const refreshUser = () => {
    // The query will automatically refetch
  }

  const isLoading = loading || (token !== null && user === undefined)

  return (
    <AuthContext.Provider value={{ 
      user: user ?? null, 
      loading: isLoading, 
      token, 
      login, 
      register, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return (
    <BaseConvexProvider client={convex}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </BaseConvexProvider>
  )
}

export const useAuth = () => useContext(AuthContext)

export { convex, api }
export type { User }
