import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'
import { DashboardClientProviders } from '@/components/dashboard/ClientProviders'
import './dashboard.css'

export const metadata = {
  title: 'Dashboard - IN-WAVE Architects',
  description: 'Admin dashboard for managing IN-WAVE Architects website content',
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
    <DashboardClientProviders>
      <div className="dashboard-layout">
        <DashboardSidebar />
        <div className="dashboard-main">
          <DashboardHeader userEmail={user.email || 'Admin'} />
          <main className="dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </DashboardClientProviders>
  )
}
