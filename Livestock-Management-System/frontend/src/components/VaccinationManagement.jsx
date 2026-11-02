import { useState, useEffect } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { getCurrentUser, isAdmin, getUserId } from '../utils/auth'

const STORAGE_KEY = 'livestock_vaccinations'

const getAllVaccinations = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing vaccinations from localStorage:', e)
    }
  }
  return []
}

const getFilteredVaccinations = () => {
  const allVaccinations = getAllVaccinations()
  if (isAdmin()) {
    return allVaccinations
  }
  const userId = getUserId()
  return allVaccinations.filter(vaccination => vaccination.userId === userId)
}

export default function VaccinationManagement() {
  const [vaccinations, setVaccinations] = useState(getFilteredVaccinations)

  // Reload filtered vaccinations when component mounts or user changes
  useEffect(() => {
    setVaccinations(getFilteredVaccinations())
  }, [])

  // Save to localStorage whenever vaccinations change (only for user's own data)
  const saveVaccinations = (updatedVaccinations) => {
    const allVaccinations = getAllVaccinations()
    const userId = getUserId()
    
    if (isAdmin()) {
      // Admin can modify all data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVaccinations))
    } else {
      // User can only modify their own data
      const otherUsersVaccinations = allVaccinations.filter(vaccination => vaccination.userId !== userId)
      const userVaccinations = updatedVaccinations.filter(vaccination => vaccination.userId === userId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherUsersVaccinations, ...userVaccinations]))
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [currentVaccination, setCurrentVaccination] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    animal: '',
    vaccineName: '',
    vaccinationDate: '',
    nextDueDate: '',
    notes: ''
  })

  const handleAddVaccination = () => {
    setIsEditing(false)
    setFormData({
      animal: '',
      vaccineName: '',
      vaccinationDate: '',
      nextDueDate: '',
      notes: ''
    })
    setShowModal(true)
  }

  const handleEditVaccination = (vaccination) => {
    const userId = getUserId()
    
    // Check if user can edit this vaccination
    if (!isAdmin() && vaccination.userId !== userId) {
      alert('You can only edit your own data')
      return
    }
    
    setIsEditing(true)
    setCurrentVaccination(vaccination)
    setFormData({ ...vaccination })
    setShowModal(true)
  }

  const handleDeleteVaccination = (id) => {
    const vaccinationToDelete = vaccinations.find(vaccination => vaccination.id === id)
    const userId = getUserId()
    
    // Check if user can delete this vaccination
    if (!isAdmin() && vaccinationToDelete.userId !== userId) {
      alert('You can only delete your own data')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      const updatedVaccinations = vaccinations.filter(vaccination => vaccination.id !== id)
      setVaccinations(updatedVaccinations)
      saveVaccinations(updatedVaccinations)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = getUserId()
    const allVaccinations = getAllVaccinations()
    
    if (isEditing) {
      const updatedVaccinations = vaccinations.map(vaccination => vaccination.id === currentVaccination.id ? { ...formData, id: currentVaccination.id, userId: currentVaccination.userId } : vaccination)
      setVaccinations(updatedVaccinations)
      saveVaccinations(updatedVaccinations)
    } else {
      const newId = allVaccinations.length > 0 ? Math.max(...allVaccinations.map(v => v.id)) + 1 : 1
      const newVaccination = { ...formData, id: newId, userId: userId, createdAt: new Date().toISOString() }
      const updatedVaccinations = [...vaccinations, newVaccination]
      setVaccinations(updatedVaccinations)
      saveVaccinations(updatedVaccinations)
    }
    setShowModal(false)
  }

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo
        src="https://videos.pexels.com/video-files/25749458/11905822_1920_1080_30fps.mp4"
        poster="/livestock_manager_img/vacination.jpeg"
      />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vaccination Management</h1>
          <button
            onClick={handleAddVaccination}
            className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Record Vaccination
          </button>
        </div>

        {/* Vaccinations Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vaccine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vaccination Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {vaccinations.map((vaccination) => (
                  <tr key={vaccination.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{vaccination.animal}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{vaccination.vaccineName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{vaccination.vaccinationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{vaccination.nextDueDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{vaccination.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(isAdmin() || vaccination.userId === getUserId()) && (
                        <>
                          <button
                            onClick={() => handleEditVaccination(vaccination)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVaccination(vaccination.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add/Edit Vaccination */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? 'Edit Vaccination Record' : 'Record New Vaccination'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Animal</label>
                      <input
                        type="text"
                        name="animal"
                        value={formData.animal}
                        onChange={handleChange}
                        required
                        placeholder="Enter animal name or tag"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Vaccine Name</label>
                      <input
                        type="text"
                        name="vaccineName"
                        value={formData.vaccineName}
                        onChange={handleChange}
                        required
                        placeholder="Enter vaccine name"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Vaccination Date</label>
                      <input
                        type="date"
                        name="vaccinationDate"
                        value={formData.vaccinationDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Next Due Date</label>
                      <input
                        type="date"
                        name="nextDueDate"
                        value={formData.nextDueDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-foreground">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {isEditing ? 'Update Record' : 'Record Vaccination'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}