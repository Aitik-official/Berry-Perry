import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AvoneHome } from '@/components/avone-home'

export function CricketHomePage() {
  return (
    <div id="top" className="min-h-screen bg-white text-[#1A1A1A]">
      <SiteHeader />
      <main>
        <AvoneHome />
      </main>
      <SiteFooter />
    </div>
  )
}
