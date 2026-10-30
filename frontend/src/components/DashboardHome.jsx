import { useState, useEffect } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { 
  UsersIcon, 
  Circle as PawIcon, 
  SyringeIcon, 
  UtensilsIcon,
  CalendarIcon,
  TrendingUpIcon
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { isAdmin, getUserId } from '../utils/auth'

// Helper functions to get data
const getAllOwners = () => {
  const saved = localStorage.getItem('livestock_owners')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return []
    }
  }
  return []
}

const getAllAnimals = () => {
  const saved = localStorage.getItem('livestock_animals')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return []
    }
  }
  return []
}

const getAllVaccinations = () => {
  const saved = localStorage.getItem('livestock_vaccinations')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return []
    }
  }
  return []
}

const getAllFeedingRecords = () => {
  const saved = localStorage.getItem('livestock_feeding')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return []
    }
  }
  return []
}

// Filter data based on user role
const getFilteredData = (allData) => {
  if (isAdmin()) {
    return allData
  }
  const userId = getUserId()
  return allData.filter(item => item.userId === userId)
}

// Calculate percentage change
const calculateChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? '+100%' : '0%'
  }
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${Math.round(change)}%`
}

// Get records created in a date range
const getRecordsInDateRange = (records, startDate, endDate) => {
  return records.filter(record => {
    const createdAt = record.createdAt || record.id // Use createdAt if available, otherwise use id as timestamp
    const recordDate = new Date(createdAt)
    return recordDate >= startDate && recordDate <= endDate
  })
}

export default function DashboardHome() {
  const [stats, setStats] = useState([
    { name: 'Total Owners', value: '0', icon: UsersIcon, change: '0%' },
    { name: 'Total Animals', value: '0', icon: PawIcon, change: '0%' },
    { name: 'Vaccinations Due', value: '0', icon: SyringeIcon, change: '0%' },
    { name: 'Feeding Schedules', value: '0', icon: UtensilsIcon, change: '0%' },
  ])

  const [vaccinationData, setVaccinationData] = useState([])
  const [animalData, setAnimalData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const calculateStats = () => {
    // Get all data
    const allOwners = getAllOwners()
    const allAnimals = getAllAnimals()
    const allVaccinations = getAllVaccinations()
    const allFeedingRecords = getAllFeedingRecords()

    // Filter based on user role
    const owners = getFilteredData(allOwners)
    const animals = getFilteredData(allAnimals)
    const vaccinations = getFilteredData(allVaccinations)
    const feedingRecords = getFilteredData(allFeedingRecords)

    // Calculate current counts
    const totalOwners = owners.length
    const totalAnimals = animals.length
    const totalFeedingSchedules = feedingRecords.length

    // Calculate vaccinations due (nextDueDate is in the past or within next 30 days)
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    const vaccinationsDue = vaccinations.filter(vacc => {
      if (!vacc.nextDueDate) return false
      const dueDate = new Date(vacc.nextDueDate)
      return dueDate <= nextMonth && dueDate >= today
    }).length

    // Calculate percentage changes (comparing last 30 days vs previous 30 days)
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const ownersLast30 = getRecordsInDateRange(owners, last30Days, now).length
    const ownersPrevious30 = getRecordsInDateRange(owners, previous30Days, last30Days).length
    const ownersChange = calculateChange(ownersLast30, ownersPrevious30)

    const animalsLast30 = getRecordsInDateRange(animals, last30Days, now).length
    const animalsPrevious30 = getRecordsInDateRange(animals, previous30Days, last30Days).length
    const animalsChange = calculateChange(animalsLast30, animalsPrevious30)

    const vaccinationsLast30 = getRecordsInDateRange(vaccinations, last30Days, now).length
    const vaccinationsPrevious30 = getRecordsInDateRange(vaccinations, previous30Days, last30Days).length
    const vaccinationsChange = calculateChange(vaccinationsLast30, vaccinationsPrevious30)

    const feedingLast30 = getRecordsInDateRange(feedingRecords, last30Days, now).length
    const feedingPrevious30 = getRecordsInDateRange(feedingRecords, previous30Days, last30Days).length
    const feedingChange = calculateChange(feedingLast30, feedingPrevious30)

    // Update stats
    setStats([
      { name: 'Total Owners', value: totalOwners.toString(), icon: UsersIcon, change: ownersChange },
      { name: 'Total Animals', value: totalAnimals.toString(), icon: PawIcon, change: animalsChange },
      { name: 'Vaccinations Due', value: vaccinationsDue.toString(), icon: SyringeIcon, change: vaccinationsChange },
      { name: 'Feeding Schedules', value: totalFeedingSchedules.toString(), icon: UtensilsIcon, change: feedingChange },
    ])

    // Calculate vaccination data by month (last 6 months)
    const vaccinationByMonth = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const count = vaccinations.filter(vacc => {
        const vaccDate = new Date(vacc.vaccinationDate || vacc.createdAt || vacc.id)
        return vaccDate >= monthStart && vaccDate <= monthEnd
      }).length

      vaccinationByMonth.push({
        name: monthNames[date.getMonth()],
        vaccinations: count
      })
    }
    setVaccinationData(vaccinationByMonth)

    // Calculate animal distribution by species
    const speciesCount = {}
    animals.forEach(animal => {
      const species = animal.species || 'Unknown'
      speciesCount[species] = (speciesCount[species] || 0) + 1
    })

    const animalDistribution = Object.entries(speciesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4) // Top 4 species

    setAnimalData(animalDistribution)

    // Get recent activity (last 5 records from all categories)
    const activities = []
    
    // Recent vaccinations
    vaccinations
      .sort((a, b) => {
        const dateA = new Date(a.vaccinationDate || a.createdAt || a.id)
        const dateB = new Date(b.vaccinationDate || b.createdAt || b.id)
        return dateB - dateA
      })
      .slice(0, 2)
      .forEach(vacc => {
        activities.push({
          type: 'vaccination',
          message: `Vaccination completed for ${vacc.animal}`,
          date: new Date(vacc.vaccinationDate || vacc.createdAt || vacc.id),
          icon: SyringeIcon
        })
      })

    // Recent feeding records
    feedingRecords
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id)
        const dateB = new Date(b.createdAt || b.id)
        return dateB - dateA
      })
      .slice(0, 2)
      .forEach(record => {
        activities.push({
          type: 'feeding',
          message: `Feeding schedule updated for ${record.animal}`,
          date: new Date(record.createdAt || record.id),
          icon: UtensilsIcon
        })
      })

    // Recent animals
    animals
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id)
        const dateB = new Date(b.createdAt || b.id)
        return dateB - dateA
      })
      .slice(0, 1)
      .forEach(animal => {
        activities.push({
          type: 'animal',
          message: `New animal registered: ${animal.species} ${animal.tagId}`,
          date: new Date(animal.createdAt || animal.id),
          icon: PawIcon
        })
      })

    // Sort all activities by date and take top 3
    activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 3)

    setRecentActivity(activities.sort((a, b) => b.date - a.date).slice(0, 3))
  }

  useEffect(() => {
    calculateStats()
    
    // Refresh stats when window gains focus (user might have added data in another tab)
    const handleFocus = () => {
      calculateStats()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Also refresh periodically (every 30 seconds) to catch changes
    const interval = setInterval(calculateStats, 30000)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  // Format time ago
  const getTimeAgo = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo
        src="https://videos.pexels.com/video-files/25749458/11905822_1920_1080_30fps.mp4"
        poster="/livestock_manager_img/dashboard.jpeg"
      />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.change} from last month</p>
            </div>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vaccination Chart */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Vaccinations Overview</h2>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-80">
              {vaccinationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vaccinationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vaccinations" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No vaccination data available
                </div>
              )}
            </div>
          </div>
          
          {/* Animal Distribution Chart */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Animal Distribution</h2>
              <TrendingUpIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-80">
              {animalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={animalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No animal data available
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-start">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{getTimeAgo(activity.date)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
