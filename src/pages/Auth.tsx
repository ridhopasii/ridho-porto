import React, { useState } from 'react'
import { signInWithEmail } from '@/lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await signInWithEmail(email, password)
      if (res.error) {
        setError(res.error.message)
      } else {
        // on success, reload or redirect to home
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Masuk</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        {error && <div className="text-destructive">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Menghubungkan...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
