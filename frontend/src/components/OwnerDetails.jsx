import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, UserRound } from 'lucide-react'
import { getCurrentUser, isAdmin, getUserId } from '../utils/auth'

const STORAGE_KEY = 'livestock_owners'

const getAllOwners = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing owners from localStorage:', e)
    }
  }
  return []
}

const getFilteredOwners = () => {
  const allOwners = getAllOwners()
  if (isAdmin()) {
    return allOwners
  }
  const userId = getUserId()
  return allOwners.filter(owner => owner.userId === userId)
}

export default function OwnerDetails() {
  const [owners, setOwners] = useState(getFilteredOwners)

  // Reload filtered owners when component mounts or user changes
  useEffect(() => {
    setOwners(getFilteredOwners())
  }, [])

  // Save to localStorage whenever owners change (only for user's own data)
  const saveOwners = (updatedOwners) => {
    const allOwners = getAllOwners()
    const userId = getUserId()
    
    if (isAdmin()) {
      // Admin can modify all data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOwners))
    } else {
      // User can only modify their own data
      const otherUsersOwners = allOwners.filter(owner => owner.userId !== userId)
      const userOwners = updatedOwners.filter(owner => owner.userId === userId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherUsersOwners, ...userOwners]))
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [currentOwner, setCurrentOwner] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  const handleAddOwner = () => {
    setIsEditing(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    })
    setShowModal(true)
  }

  const handleEditOwner = (owner) => {
    const userId = getUserId()
    
    // Check if user can edit this owner
    if (!isAdmin() && owner.userId !== userId) {
      alert('You can only edit your own data')
      return
    }
    
    setIsEditing(true)
    setCurrentOwner(owner)
    setFormData({ ...owner })
    setShowModal(true)
  }

  const handleDeleteOwner = (id) => {
    const ownerToDelete = owners.find(owner => owner.id === id)
    const userId = getUserId()
    
    // Check if user can delete this owner
    if (!isAdmin() && ownerToDelete.userId !== userId) {
      alert('You can only delete your own data')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this owner?')) {
      const updatedOwners = owners.filter(owner => owner.id !== id)
      setOwners(updatedOwners)
      saveOwners(updatedOwners)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = getUserId()
    const allOwners = getAllOwners()
    
    if (isEditing) {
      const updatedOwners = owners.map(owner => owner.id === currentOwner.id ? { ...formData, id: currentOwner.id, userId: currentOwner.userId } : owner)
      setOwners(updatedOwners)
      saveOwners(updatedOwners)
    } else {
      const newId = allOwners.length > 0 ? Math.max(...allOwners.map(o => o.id)) + 1 : 1
      const newOwner = { ...formData, id: newId, userId: userId, createdAt: new Date().toISOString() }
      const updatedOwners = [...owners, newOwner]
      setOwners(updatedOwners)
      saveOwners(updatedOwners)
    }
    setShowModal(false)
  }

  return (
    <div className="owner-details-background min-h-screen">
      <div className="video-background-content owner-details-content min-h-screen">
      <div className="owner-details-header flex justify-between items-center mb-6">
        <div className="owner-details-title">
          <div className="owner-details-profile-icon" aria-hidden="true">
            <UserRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Farm Owner Profile</h1>
            <p className="text-sm text-muted-foreground">Manage owner identity and contact information</p>
          </div>
        </div>
        <button
          onClick={handleAddOwner}
          className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Owner
        </button>
      </div>

      {/* Owners Table */}
      <div className="bg-card owner-details-table rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{owner.firstName} {owner.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{owner.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{owner.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {owner.address.street}, {owner.address.city}, {owner.address.state} {owner.address.zipCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(isAdmin() || owner.userId === getUserId()) && (
                      <>
                        <button
                          onClick={() => handleEditOwner(owner)}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOwner(owner.id)}
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

      {/* Modal for Add/Edit Owner */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 owner-details-modal">
          <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto owner-details-dialog">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Owner Information' : 'Owner Information'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">State</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">ZIP Code</label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-foreground">Country</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
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
                    {isEditing ? 'Update Owner' : 'Add Owner'}
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