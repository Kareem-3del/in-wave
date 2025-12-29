import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'
import './dashboard.css'

export const metadata = {
  title: 'Dashboard - NKEY Architects',
  description: 'Admin dashboard for managing NKEY Architects website content',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader userEmail={user.email || 'Admin'} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}
