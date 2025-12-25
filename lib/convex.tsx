'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ConvexReactClient, useQuery } from 'convex/react'
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
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
})

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

function AuthProviderInner({ children, initialToken }: { children: ReactNode; initialToken?: string | null }) {
  const [token, setToken] = useState<string | null>(initialToken ?? null)
  const [loading, setLoading] = useState(!initialToken)

  const user = useQuery(api.auth.getCurrentUser, token ? { token } : "skip") as User | null | undefined

  useEffect(() => {
    if (!initialToken) {
      refreshUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken])

  useEffect(() => {
    if (user === null && token) {
      setToken(null)
    }
  }, [user, token])

  const login = async (email: string, password: string) => {
    const result = await fetchJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    setToken(result.token)
  }

  const register = async (email: string, password: string, role: 'child' | 'parent') => {
    const result = await fetchJson('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })
    setToken(result.token)
  }

  const logout = async () => {
    await fetchJson('/api/auth/logout', { method: 'POST' })
    setToken(null)
  }

  const refreshUser = async () => {
    setLoading(true)
    try {
      const result = await fetchJson('/api/auth/session')
      setToken(result.token)
    } finally {
      setLoading(false)
    }
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
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function ConvexAuthProvider({ children, initialToken }: { children: ReactNode; initialToken?: string | null }) {
  return (
    <BaseConvexProvider client={convex}>
      <AuthProviderInner initialToken={initialToken}>{children}</AuthProviderInner>
    </BaseConvexProvider>
  )
}

export const useAuth = () => useContext(AuthContext)

export { convex, api }
export type { User }
