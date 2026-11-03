import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useTheme } from '../components/useTheme'
import Sidebar from '../components/Sidebar'
import TopNavbar from '../components/TopNavbar'
import DashboardHome from '../components/DashboardHome'
import OwnerDetails from '../components/OwnerDetails'
import AnimalDetails from '../components/AnimalDetails'
import VaccinationManagement from '../components/VaccinationManagement'
import FeedingSummary from '../components/FeedingSummary'
import { clearAuth, getAuthToken } from '../utils/api'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  useEffect(() => {
    const handleUnauthorized = () => navigate('/user-login', { replace: true })
    window.addEventListener('livestock:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('livestock:unauthorized', handleUnauthorized)
  }, [navigate])

  if (!getAuthToken()) {
    return <Navigate to="/user-login" replace />
  }

  return (
    <div className="dashboard-shell flex h-screen bg-background text-foreground">
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
        
        <main className="dashboard-main flex-1 overflow-y-auto p-4 md:p-6 bg-background">
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