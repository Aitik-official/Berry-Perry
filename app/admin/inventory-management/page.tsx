import { Suspense } from 'react'
import { AdminDashboardClient } from '../admin-dashboard-client'

export const metadata = {
  title: 'Inventory Management | Berry Perry Kids Admin',
  description: 'Manage warehouse stock ledger, supplier purchase orders, waste logging, customer returns, and vendors.',
}

export default function InventoryManagementAdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-bold">Loading Inventory Management...</div>}>
      <AdminDashboardClient initialTab="inventory-management" />
    </Suspense>
  )
}
