import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../components/ThemeProvider'
import Sidebar from '../components/Sidebar'
import TopNavbar from '../components/TopNavbar'
import DashboardHome from '../components/DashboardHome'
import OwnerDetails from '../components/OwnerDetails'
import AnimalDetails from '../components/AnimalDetails'
import VaccinationManagement from '../components/VaccinationManagement'
import FeedingSummary from '../components/FeedingSummary'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    // Clear the current user session
    localStorage.removeItem('livestock_current_user')
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleLogout={handleLogout}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          toggleTheme={toggleTheme}
          theme={theme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/owners" element={<OwnerDetails />} />
            <Route path="/animals" element={<AnimalDetails />} />
            <Route path="/vaccinations" element={<VaccinationManagement />} />
            <Route path="/feeding" element={<FeedingSummary />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}