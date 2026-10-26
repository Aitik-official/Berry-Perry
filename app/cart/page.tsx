import { CartClient } from './cart-client'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'Shopping Bag | Berry Perry Baby & Kids Store',
  description: 'Review your selected Berry Perry baby clothes, toddler wear, toys, and nursery essentials.',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1A1A1A]">
      <SiteHeader />
      <CartClient />
      <SiteFooter />
    </div>
  )
}
