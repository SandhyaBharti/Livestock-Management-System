import { useState } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import useApiCollection from '../hooks/useApiCollection'

const emptyVaccination = { animal: '', vaccineName: '', vaccinationDate: '', nextDueDate: '', notes: '' }
const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : ''
const animalLabel = (animal) => animal && typeof animal === 'object'
  ? `${animal.tagId} - ${animal.species}`
  : animal || 'Unknown animal'

export default function VaccinationManagement() {
  const { items: vaccinations, loading, error, setError, create, update, remove } = useApiCollection('/vaccinations')
  const { items: animals, error: animalsError } = useApiCollection('/animals')
  const [showModal, setShowModal] = useState(false)
  const [currentVaccination, setCurrentVaccination] = useState(null)
  const [formData, setFormData] = useState(emptyVaccination)
  const [saving, setSaving] = useState(false)

  const openNewVaccination = () => {
    setCurrentVaccination(null)
    setFormData(emptyVaccination)
    setError('')
    setShowModal(true)
  }

  const editVaccination = (vaccination) => {
    setCurrentVaccination(vaccination)
    setFormData({
      animal: typeof vaccination.animal === 'object' ? vaccination.animal._id : vaccination.animal,
      vaccineName: vaccination.vaccineName,
      vaccinationDate: dateValue(vaccination.vaccinationDate),
      nextDueDate: dateValue(vaccination.nextDueDate),
      notes: vaccination.notes || ''
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (currentVaccination) await update(currentVaccination._id, formData)
      else await create(formData)
      setShowModal(false)
    } catch {
      // The collection hook exposes the API error in the page.
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (vaccination) => {
    if (!window.confirm(`Delete vaccination record for ${animalLabel(vaccination.animal)}?`)) return
    try {
      await remove(vaccination._id)
    } catch {
      // The collection hook exposes the API error in the page.
    }
  }

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo src="https://videos.pexels.com/video-files/25749458/11905822_1920_1080_30fps.mp4" poster="/livestock_manager_img/vacination.jpeg" />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Vaccination Management</h1>
            <p className="text-sm text-muted-foreground">Track vaccine history and upcoming due dates</p>
          </div>
          <button onClick={openNewVaccination} className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" /> Record Vaccination
          </button>
        </div>
        {(error || animalsError) && <p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-destructive">{error || animalsError}</p>}

        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>{['Animal', 'Vaccine', 'Vaccination Date', 'Next Due', 'Notes', 'Actions'].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{heading}</th>)}</tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {vaccinations.map((vaccination) => (
                  <tr key={vaccination._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{animalLabel(vaccination.animal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{vaccination.vaccineName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{dateValue(vaccination.vaccinationDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{dateValue(vaccination.nextDueDate)}</td>
                    <td className="px-6 py-4 text-sm">{vaccination.notes || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" aria-label={`Edit ${vaccination.vaccineName}`} onClick={() => editVaccination(vaccination)} className="text-primary hover:text-primary/80 mr-3"><PencilIcon className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Delete ${vaccination.vaccineName}`} onClick={() => handleDelete(vaccination)} className="text-destructive hover:text-destructive/80"><TrashIcon className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {!loading && vaccinations.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No vaccination records yet.</td></tr>}
              </tbody>
            </table>
          </div>
          {loading && <p className="p-4 text-sm text-muted-foreground">Loading vaccinations from MongoDB...</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">{currentVaccination ? 'Edit Vaccination Record' : 'Record New Vaccination'}</h2>
              {!animals.length && <p role="alert" className="mb-4 text-sm text-destructive">Add an animal before recording vaccinations.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="vaccination-animal" className="block text-sm font-medium mb-1">Animal</label>
                  <select id="vaccination-animal" value={formData.animal} onChange={(event) => setFormData((current) => ({ ...current, animal: event.target.value }))} required disabled={!animals.length} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select an animal</option>
                    {animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.tagId} - {animal.species}</option>)}
                  </select>
                </div>
                {[
                  ['vaccineName', 'Vaccine Name', 'text'],
                  ['vaccinationDate', 'Vaccination Date', 'date'],
                  ['nextDueDate', 'Next Due Date', 'date']
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label htmlFor={`vaccination-${name}`} className="block text-sm font-medium mb-1">{label}</label>
                    <input id={`vaccination-${name}`} type={type} value={formData[name]} onChange={(event) => setFormData((current) => ({ ...current, [name]: event.target.value }))} required className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label htmlFor="vaccination-notes" className="block text-sm font-medium mb-1">Notes</label>
                  <textarea id="vaccination-notes" value={formData.notes} onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))} rows="3" maxLength="500" className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-input rounded-md hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving || !animals.length} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-60">{saving ? 'Saving...' : currentVaccination ? 'Update Vaccination' : 'Record Vaccination'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
