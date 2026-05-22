import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import supabase from '@/lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setAuthed(Boolean(data?.user))
      setLoading(false)
    }
    check()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-4">Memeriksa autentikasi...</div>
  if (!authed) return <Navigate to="/auth" replace />
  return <>{children}</>
}
