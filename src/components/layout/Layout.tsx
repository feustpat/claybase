import { Outlet } from 'react-router-dom'
import Header from './Header'
import HelpPanel from '@/components/gallery/HelpPanel'
import { HelpProvider, useHelp } from '@/context/HelpContext'
import { SidebarProvider } from '@/context/SidebarContext'

function LayoutInner() {
  const { helpOpen, closeHelp } = useHelp()
  return (
    <div className="flex min-h-screen flex-col bg-ctp-base">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {helpOpen && <HelpPanel onClose={closeHelp} />}
    </div>
  )
}

export default function Layout() {
  return (
    <HelpProvider>
      <SidebarProvider>
        <LayoutInner />
      </SidebarProvider>
    </HelpProvider>
  )
}
