/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

interface HelpContextValue {
  helpOpen: boolean
  toggleHelp: () => void
  closeHelp: () => void
}

const HelpContext = createContext<HelpContextValue>({
  helpOpen: false,
  toggleHelp: () => {},
  closeHelp: () => {},
})

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false)
  return (
    <HelpContext.Provider
      value={{
        helpOpen,
        toggleHelp: () => setHelpOpen((o) => !o),
        closeHelp: () => setHelpOpen(false),
      }}
    >
      {children}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  return useContext(HelpContext)
}
