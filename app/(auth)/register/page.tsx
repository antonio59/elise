'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/convex'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'child' | 'parent'>('child')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await register(email, password, role)
      router.push('/dashboard')
    } catch (error: any) {
      setMessage(error.message || 'Registration failed')
      setLoading(false)
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"

  return (
    <main className="py-10 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold">Join Elise!</h2>
        <p className="text-neutral-500 mt-2">Create your bookshelf account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <span className="text-sm font-medium">Account Type</span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => setRole('child')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                role === 'child' 
                  ? 'border-inkPink bg-inkPink/10' 
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-inkPink/50'
              }`}
            >
              <div className="text-3xl mb-1">📚</div>
              <div className="font-medium">Reader</div>
              <div className="text-xs text-neutral-500">For kids</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                role === 'parent' 
                  ? 'border-inkPurple bg-inkPurple/10' 
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-inkPurple/50'
              }`}
            >
              <div className="text-3xl mb-1">👨‍👩‍👧</div>
              <div className="font-medium">Parent</div>
              <div className="text-xs text-neutral-500">Manage content</div>
            </button>
          </div>
        </div>

        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} required minLength={6} />
          <p className="text-xs text-neutral-500 mt-1">At least 6 characters</p>
        </label>
        <label className="block">
          <span className="text-sm">Confirm Password</span>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} required />
        </label>
        
        <button type="submit" disabled={loading} className={`w-full rounded-md text-white px-4 py-3 font-medium transition-colors disabled:opacity-50 ${
          role === 'child' ? 'bg-inkPink hover:bg-pink-600' : 'bg-inkPurple hover:bg-purple-700'
        }`}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="text-sm text-center">Already have an account? <Link href="/login" className="text-inkCyan hover:underline">Log in</Link></p>
        {message && <p className="text-sm text-red-600 text-center" role="alert">{message}</p>}
      </form>
    </main>
  )
}
