import { useState, useEffect } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { getCurrentUser, isAdmin, getUserId } from '../utils/auth'

const STORAGE_KEY = 'livestock_feeding'

const getAllFeedingRecords = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing feeding records from localStorage:', e)
    }
  }
  return []
}

const getFilteredFeedingRecords = () => {
  const allRecords = getAllFeedingRecords()
  if (isAdmin()) {
    return allRecords
  }
  const userId = getUserId()
  return allRecords.filter(record => record.userId === userId)
}

export default function FeedingSummary() {
  const [feedingRecords, setFeedingRecords] = useState(getFilteredFeedingRecords)

  // Reload filtered feeding records when component mounts or user changes
  useEffect(() => {
    setFeedingRecords(getFilteredFeedingRecords())
  }, [])

  // Save to localStorage whenever feeding records change (only for user's own data)
  const saveFeedingRecords = (updatedRecords) => {
    const allRecords = getAllFeedingRecords()
    const userId = getUserId()
    
    if (isAdmin()) {
      // Admin can modify all data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))
    } else {
      // User can only modify their own data
      const otherUsersRecords = allRecords.filter(record => record.userId !== userId)
      const userRecords = updatedRecords.filter(record => record.userId === userId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherUsersRecords, ...userRecords]))
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    animal: '',
    feedType: '',
    quantity: '',
    unit: 'kg',
    frequency: 'daily',
    notes: ''
  })

  const handleAddRecord = () => {
    setIsEditing(false)
    setFormData({
      animal: '',
      feedType: '',
      quantity: '',
      unit: 'kg',
      frequency: 'daily',
      notes: ''
    })
    setShowModal(true)
  }

  const handleEditRecord = (record) => {
    const userId = getUserId()
    
    // Check if user can edit this record
    if (!isAdmin() && record.userId !== userId) {
      alert('You can only edit your own data')
      return
    }
    
    setIsEditing(true)
    setCurrentRecord(record)
    setFormData({ ...record })
    setShowModal(true)
  }

  const handleDeleteRecord = (id) => {
    const recordToDelete = feedingRecords.find(record => record.id === id)
    const userId = getUserId()
    
    // Check if user can delete this record
    if (!isAdmin() && recordToDelete.userId !== userId) {
      alert('You can only delete your own data')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this feeding record?')) {
      const updatedRecords = feedingRecords.filter(record => record.id !== id)
      setFeedingRecords(updatedRecords)
      saveFeedingRecords(updatedRecords)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseFloat(value) || '' : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = getUserId()
    const allRecords = getAllFeedingRecords()
    
    if (isEditing) {
      const updatedRecords = feedingRecords.map(record => record.id === currentRecord.id ? { ...formData, id: currentRecord.id, userId: currentRecord.userId } : record)
      setFeedingRecords(updatedRecords)
      saveFeedingRecords(updatedRecords)
    } else {
      const newId = allRecords.length > 0 ? Math.max(...allRecords.map(r => r.id)) + 1 : 1
      const newRecord = { ...formData, id: newId, userId: userId, createdAt: new Date().toISOString() }
      const updatedRecords = [...feedingRecords, newRecord]
      setFeedingRecords(updatedRecords)
      saveFeedingRecords(updatedRecords)
    }
    setShowModal(false)
  }

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo
        src="https://videos.pexels.com/video-files/5930448/5930448-uhd_1440_2560_30fps.mp4"
        poster="/livestock_manager_img/feeding.jpeg"
      />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feeding Summary</h1>
          <button
            onClick={handleAddRecord}
            className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Feeding Record
          </button>
        </div>

        {/* Feeding Records Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Feed Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {feedingRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{record.animal}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{record.feedType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{record.quantity} {record.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm capitalize">{record.frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{record.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(isAdmin() || record.userId === getUserId()) && (
                        <>
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Feed Types</h3>
            <p className="text-3xl font-bold">5</p>
            <p className="text-sm text-muted-foreground mt-1">Different feed varieties</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Daily Consumption</h3>
            <p className="text-3xl font-bold">120 kg</p>
            <p className="text-sm text-muted-foreground mt-1">Across all animals</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Feeding Schedule</h3>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-sm text-muted-foreground mt-1">On-time compliance</p>
          </div>
        </div>

        {/* Modal for Add/Edit Feeding Record */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? 'Edit Feeding Record' : 'Add New Feeding Record'}
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
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Feed Type</label>
                      <input
                        type="text"
                        name="feedType"
                        value={formData.feedType}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Unit</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                        <option value="grams">grams</option>
                        <option value="liters">liters</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Frequency</label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="as needed">As Needed</option>
                      </select>
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
                      {isEditing ? 'Update Record' : 'Add Record'}
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