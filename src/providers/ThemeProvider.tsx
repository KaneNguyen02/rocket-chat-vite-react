import { createContext, useContext, useState } from 'react'
import StorageService from '../utils/storage'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}
interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState<boolean>(StorageService.get('dark-mode') || false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    StorageService.set('dark-mode', !darkMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}
