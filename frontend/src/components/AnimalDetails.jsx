import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { getCurrentUser, isAdmin, getUserId } from '../utils/auth'

const STORAGE_KEY = 'livestock_animals'

const getAllAnimals = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error parsing animals from localStorage:', e)
    }
  }
  return []
}

const getFilteredAnimals = () => {
  const allAnimals = getAllAnimals()
  if (isAdmin()) {
    return allAnimals
  }
  const userId = getUserId()
  return allAnimals.filter(animal => animal.userId === userId)
}

export default function AnimalDetails() {
  const [animals, setAnimals] = useState(getFilteredAnimals)

  // Reload filtered animals when component mounts or user changes
  useEffect(() => {
    setAnimals(getFilteredAnimals())
  }, [])

  // Save to localStorage whenever animals change (only for user's own data)
  const saveAnimals = (updatedAnimals) => {
    const allAnimals = getAllAnimals()
    const userId = getUserId()
    
    if (isAdmin()) {
      // Admin can modify all data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnimals))
    } else {
      // User can only modify their own data
      const otherUsersAnimals = allAnimals.filter(animal => animal.userId !== userId)
      const userAnimals = updatedAnimals.filter(animal => animal.userId === userId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherUsersAnimals, ...userAnimals]))
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    tagId: '',
    species: '',
    breed: '',
    age: '',
    owner: ''
  })

  const handleAddAnimal = () => {
    setIsEditing(false)
    setFormData({
      tagId: '',
      species: '',
      breed: '',
      age: '',
      owner: ''
    })
    setShowModal(true)
  }

  const handleEditAnimal = (animal) => {
    const userId = getUserId()
    
    // Check if user can edit this animal
    if (!isAdmin() && animal.userId !== userId) {
      alert('You can only edit your own data')
      return
    }
    
    setIsEditing(true)
    setCurrentAnimal(animal)
    setFormData({ ...animal })
    setShowModal(true)
  }

  const handleDeleteAnimal = (id) => {
    const animalToDelete = animals.find(animal => animal.id === id)
    const userId = getUserId()
    
    // Check if user can delete this animal
    if (!isAdmin() && animalToDelete.userId !== userId) {
      alert('You can only delete your own data')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this animal?')) {
      const updatedAnimals = animals.filter(animal => animal.id !== id)
      setAnimals(updatedAnimals)
      saveAnimals(updatedAnimals)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) || '' : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = getUserId()
    const allAnimals = getAllAnimals()
    
    if (isEditing) {
      const updatedAnimals = animals.map(animal => animal.id === currentAnimal.id ? { ...formData, id: currentAnimal.id, userId: currentAnimal.userId } : animal)
      setAnimals(updatedAnimals)
      saveAnimals(updatedAnimals)
    } else {
      const newId = allAnimals.length > 0 ? Math.max(...allAnimals.map(a => a.id)) + 1 : 1
      const newAnimal = { ...formData, id: newId, userId: userId, createdAt: new Date().toISOString() }
      const updatedAnimals = [...animals, newAnimal]
      setAnimals(updatedAnimals)
      saveAnimals(updatedAnimals)
    }
    setShowModal(false)
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: "url('/livestock_manager_img/home.jpeg')" }}>
      <div className="bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Animal Details</h1>
          <button
            onClick={handleAddAnimal}
            className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Animal
          </button>
        </div>

        {/* Animals Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tag ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Species</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Breed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {animals.map((animal) => (
                  <tr key={animal.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{animal.tagId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{animal.species}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{animal.breed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{animal.age} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{animal.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(isAdmin() || animal.userId === getUserId()) && (
                        <>
                          <button
                            onClick={() => handleEditAnimal(animal)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnimal(animal.id)}
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

        {/* Modal for Add/Edit Animal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? 'Edit Animal' : 'Add New Animal'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Tag ID</label>
                      <input
                        type="text"
                        name="tagId"
                        value={formData.tagId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Species</label>
                      <input
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Breed</label>
                      <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">Age (years)</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-foreground">Owner</label>
                      <input
                        type="text"
                        name="owner"
                        value={formData.owner}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
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
                      {isEditing ? 'Update Animal' : 'Add Animal'}
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