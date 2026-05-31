/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

interface SidebarContextValue {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  sidebarOpen: true,
  toggleSidebar: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('ui-sidebar-open')
    return stored !== null ? stored === 'true' : window.innerWidth >= 1024
  })

  function toggleSidebar() {
    setSidebarOpen((o) => {
      const n = !o
      localStorage.setItem('ui-sidebar-open', String(n))
      return n
    })
  }

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
