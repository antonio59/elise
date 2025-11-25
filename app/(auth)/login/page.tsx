'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/convex'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error: any) {
      setMessage(error.message || 'Login failed')
      setLoading(false)
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"

  return (
    <main className="py-10 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold">Welcome Back!</h2>
        <p className="text-neutral-500 mt-2">Log in to your bookshelf</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} required />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-inkPink text-white px-4 py-3 font-medium hover:bg-pink-600 transition-colors disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <p className="text-sm text-center">No account? <Link href="/register" className="text-inkCyan hover:underline">Register</Link></p>
        {message && <p className="text-sm text-red-600 text-center" role="alert">{message}</p>}
      </form>
    </main>
  )
}
