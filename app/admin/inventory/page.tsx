import { Suspense } from 'react'
import { AdminDashboardClient } from '../admin-dashboard-client'

export const metadata = {
  title: 'Inventory & Products | Berry Perry Kids Admin',
  description: 'Manage product catalog, sizes, colors, pricing, and stock status.',
}

export default function InventoryAdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-bold">Loading Inventory...</div>}>
      <AdminDashboardClient initialTab="inventory" />
    </Suspense>
  )
}
