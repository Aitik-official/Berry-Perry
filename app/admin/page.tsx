import { Suspense } from 'react'
import { AdminDashboardClient } from './admin-dashboard-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Admin Control Center | Berry Perry Kids Admin',
  description: 'Manage products, inventory, media assets, and website layout modules.',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center font-bold text-[#1A1A1A]">
            Loading Admin Control Center...
          </div>
        }
      >
        <AdminDashboardClient />
      </Suspense>
    </div>
  )
}
