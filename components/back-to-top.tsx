'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Don't render or show on admin pages to prevent overlapping with admin actions, modals, and toasts
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAdmin])

  if (isAdmin) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      id="back-to-top"
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      className={`fixed bottom-8 right-6 z-50 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 shadow-xl transition-all duration-300 ease-out
        ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-16 opacity-0 pointer-events-none'}
        ${hovered
          ? 'bg-[#EB008B] border-[#EB008B] text-white scale-110 shadow-[0_8px_30px_rgba(235,0,139,0.4)]'
          : 'bg-white border-[#EB008B] text-[#EB008B] shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
        }
      `}
      style={{ width: 48, height: 48 }}
    >
      <ChevronUp
        className={`transition-transform duration-300 ${hovered ? '-translate-y-0.5' : ''}`}
        size={22}
        strokeWidth={2.5}
      />
    </button>
  )
}
