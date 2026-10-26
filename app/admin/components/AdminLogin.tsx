'use client'

import { useState } from 'react'
import { Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

interface AdminLoginProps {
  onSuccess: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter the administrator password')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Incorrect password. Access denied.')
      }
    } catch {
      setError('An error occurred while authenticating. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-[#EB008B]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-[#5CB946]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xl backdrop-blur-xl sm:p-10">
        {/* Brand & Lock Badge */}
        <div className="text-center">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-[#EB008B]/10 border border-[#EB008B]/30 text-[#EB008B] shadow-inner mb-4">
            <Lock className="size-8" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black italic tracking-tighter text-[#1A1A1A]">BERRY PERRY</span>
            <span className="rounded bg-[#EB008B] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              CONTROL CENTER
            </span>
          </div>
          <h2 className="mt-4 text-xl font-black tracking-tight text-[#1A1A1A]">
            Admin Authentication
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Enter your administrator access key to manage products, inventory, media assets, and store settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm font-medium text-[#1A1A1A] placeholder-slate-400 shadow-inner outline-none transition focus:border-[#EB008B] focus:bg-white focus:ring-1 focus:ring-[#EB008B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EB008B] px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#EB008B]/25 transition hover:bg-[#d4007d] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>Protected Area • Cookie-secured Session</span>
        </div>
      </div>
    </div>
  )
}
