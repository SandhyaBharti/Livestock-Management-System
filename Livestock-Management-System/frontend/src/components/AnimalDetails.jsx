import { useState } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import useApiCollection from '../hooks/useApiCollection'

const emptyAnimal = { tagId: '', species: '', breed: '', age: '', owner: '' }

const getOwnerName = (owner) => {
  if (!owner) return 'Unknown owner'
  if (typeof owner === 'object') return `${owner.firstName} ${owner.lastName}`
  return owner
}

export default function AnimalDetails() {
  const { items: animals, loading, error, setError, create, update, remove } = useApiCollection('/animals')
  const { items: owners } = useApiCollection('/owners')
  const [showModal, setShowModal] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState(null)
  const [formData, setFormData] = useState(emptyAnimal)
  const [saving, setSaving] = useState(false)

  const openNewAnimal = () => {
    setCurrentAnimal(null)
    setFormData(emptyAnimal)
    setError('')
    setShowModal(true)
  }

  const editAnimal = (animal) => {
    setCurrentAnimal(animal)
    setFormData({
      tagId: animal.tagId,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      owner: typeof animal.owner === 'object' ? animal.owner._id : animal.owner
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, age: Number(formData.age) }
      if (currentAnimal) await update(currentAnimal._id, payload)
      else await create(payload)
      setShowModal(false)
    } catch {
      // The collection hook exposes the API error in the page.
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (animal) => {
    if (!window.confirm(`Delete animal ${animal.tagId}?`)) return
    try {
      await remove(animal._id)
    } catch {
      // The collection hook exposes the API error in the page.
    }
  }

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo src="https://videos.pexels.com/video-files/25749458/11905822_1920_1080_30fps.mp4" poster="/livestock_manager_img/home.jpeg" />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Animal Details</h1>
            <p className="text-sm text-muted-foreground">Manage your herd records</p>
          </div>
          <button onClick={openNewAnimal} className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Animal
          </button>
        </div>
        {error && <p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-destructive">{error}</p>}

        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>{['Tag ID', 'Species', 'Breed', 'Age', 'Owner', 'Actions'].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{heading}</th>)}</tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {animals.map((animal) => (
                  <tr key={animal._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{animal.tagId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{animal.species}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{animal.breed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{animal.age} years</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getOwnerName(animal.owner)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" aria-label={`Edit ${animal.tagId}`} onClick={() => editAnimal(animal)} className="text-primary hover:text-primary/80 mr-3"><PencilIcon className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Delete ${animal.tagId}`} onClick={() => handleDelete(animal)} className="text-destructive hover:text-destructive/80"><TrashIcon className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {!loading && animals.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No animals yet. Add an animal to get started.</td></tr>}
              </tbody>
            </table>
          </div>
          {loading && <p className="p-4 text-sm text-muted-foreground">Loading animals from MongoDB...</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">{currentAnimal ? 'Edit Animal' : 'Add New Animal'}</h2>
                {owners.length === 0 && <p role="alert" className="mb-4 text-sm text-destructive">Add an owner before registering an animal.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    ['tagId', 'Tag ID', 'text'],
                    ['species', 'Species', 'text'],
                    ['breed', 'Breed', 'text'],
                    ['age', 'Age (years)', 'number']
                  ].map(([name, label, type]) => (
                    <div key={name}>
                      <label htmlFor={`animal-${name}`} className="block text-sm font-medium mb-1">{label}</label>
                      <input id={`animal-${name}`} type={type} name={name} value={formData[name]} onChange={(event) => setFormData((current) => ({ ...current, [name]: event.target.value }))} required min={type === 'number' ? '0' : undefined} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label htmlFor="animal-owner" className="block text-sm font-medium mb-1">Owner</label>
                    <select id="animal-owner" name="owner" value={formData.owner} onChange={(event) => setFormData((current) => ({ ...current, owner: event.target.value }))} required disabled={!owners.length} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                      <option value="">Select an owner</option>
                      {owners.map((owner) => <option key={owner._id} value={owner._id}>{owner.firstName} {owner.lastName}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-input rounded-md hover:bg-muted">Cancel</button>
                  <button type="submit" disabled={saving || !owners.length} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-60">{saving ? 'Saving...' : currentAnimal ? 'Update Animal' : 'Add Animal'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
