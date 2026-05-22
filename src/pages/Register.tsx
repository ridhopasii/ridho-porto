import React, { useState } from 'react'
import supabase from '@/lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      // Example: create profile row in `profiles` table
      await supabase.from('profiles').insert({ id: data.user?.id, email, name })

      window.location.href = '/'
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="input" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        {error && <div className="text-destructive">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Membuat...' : 'Daftar'}</button>
      </form>
    </div>
  )
}
