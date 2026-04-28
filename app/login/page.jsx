'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogIn, Loader2, Fingerprint } from 'lucide-react'
import { startAuthentication } from '@simplewebauthn/browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const handleFaceID = async () => {
    try {
      setLoading(true)
      // Call your API to get authentication options
      const res = await fetch('/api/auth/webauthn/generate-auth-options')
      const options = await res.json()
      
      // Prompt user with Face ID / Touch ID
      const authResp = await startAuthentication(options)
      
      // Verify response with your API
      const verification = await fetch('/api/auth/webauthn/verify-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResp)
      })
      
      const verificationJSON = await verification.json()
      
      if (verificationJSON.verified) {
        // Log them in via Supabase Custom Token or Session
        router.push('/admin')
        router.refresh()
      } else {
        setError('Face ID verification failed.')
      }
    } catch (err) {
      setError('Sistem Face ID belum dikonfigurasi di server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-body px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1a1a1a] rounded-2xl border border-[var(--border-subtle)] shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-400">Silakan masuk untuk mengelola portofolio</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full bg-[#2a2a2a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full bg-[#2a2a2a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-foreground bg-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign In with Password'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a1a] text-gray-400">Atau masuk cepat dengan</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleFaceID}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-[var(--border-subtle)] rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all font-semibold"
            >
              <Fingerprint className="w-5 h-5 text-accent" />
              Face ID / Touch ID
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
