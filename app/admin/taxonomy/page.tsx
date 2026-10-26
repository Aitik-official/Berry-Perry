import { Suspense } from 'react'
import { AdminDashboardClient } from '../admin-dashboard-client'

export const metadata = {
  title: 'Taxonomies & Categories | Berry Perry Kids Admin',
  description: 'Manage main categories, sub-categories, badges, sizes, departments, announcement bar, and contact details.',
}

export default function TaxonomyAdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-bold">Loading Taxonomies...</div>}>
      <AdminDashboardClient initialTab="taxonomy" />
    </Suspense>
  )
}
