import { useState } from 'react'
import BackgroundVideo from './BackgroundVideo'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import useApiCollection from '../hooks/useApiCollection'

const emptyRecord = { animal: '', feedType: '', quantity: '', unit: 'kg', frequency: 'daily', notes: '' }
const animalLabel = (animal) => animal && typeof animal === 'object'
  ? `${animal.tagId} - ${animal.species}`
  : animal || 'Unknown animal'

export default function FeedingSummary() {
  const { items: records, loading, error, setError, create, update, remove } = useApiCollection('/nutrition')
  const { items: animals, error: animalsError } = useApiCollection('/animals')
  const [showModal, setShowModal] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [formData, setFormData] = useState(emptyRecord)
  const [saving, setSaving] = useState(false)

  const openNewRecord = () => {
    setCurrentRecord(null)
    setFormData(emptyRecord)
    setError('')
    setShowModal(true)
  }

  const editRecord = (record) => {
    setCurrentRecord(record)
    setFormData({
      animal: typeof record.animal === 'object' ? record.animal._id : record.animal,
      feedType: record.feedType,
      quantity: record.quantity,
      unit: record.unit,
      frequency: record.frequency,
      notes: record.notes || ''
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, quantity: Number(formData.quantity) }
      if (currentRecord) await update(currentRecord._id, payload)
      else await create(payload)
      setShowModal(false)
    } catch {
      // The collection hook exposes the API error in the page.
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete ${record.feedType} record for ${animalLabel(record.animal)}?`)) return
    try {
      await remove(record._id)
    } catch {
      // The collection hook exposes the API error in the page.
    }
  }

  const feedTypes = new Set(records.map((record) => record.feedType)).size
  const dailySchedules = new Set(
    records
      .filter((record) => record.frequency === 'daily')
      .map((record) => typeof record.animal === 'object' ? record.animal?._id : record.animal)
      .filter(Boolean)
  ).size

  return (
    <div className="video-background min-h-screen">
      <BackgroundVideo src="https://videos.pexels.com/video-files/5930448/5930448-uhd_1440_2560_30fps.mp4" poster="/livestock_manager_img/feeding.jpeg" />
      <div className="video-background-content bg-background/80 backdrop-blur-sm p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Feeding Summary</h1>
            <p className="text-sm text-muted-foreground">Manage nutrition plans for your animals</p>
          </div>
          <button onClick={openNewRecord} className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Feeding Record
          </button>
        </div>
        {(error || animalsError) && <p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-destructive">{error || animalsError}</p>}

        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>{['Animal', 'Feed Type', 'Quantity', 'Frequency', 'Notes', 'Actions'].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{heading}</th>)}</tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{animalLabel(record.animal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{record.feedType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{record.quantity} {record.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{record.frequency}</td>
                    <td className="px-6 py-4 text-sm">{record.notes || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" aria-label={`Edit ${record.feedType}`} onClick={() => editRecord(record)} className="text-primary hover:text-primary/80 mr-3"><PencilIcon className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Delete ${record.feedType}`} onClick={() => handleDelete(record)} className="text-destructive hover:text-destructive/80"><TrashIcon className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {!loading && records.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No feeding records yet.</td></tr>}
              </tbody>
            </table>
          </div>
          {loading && <p className="p-4 text-sm text-muted-foreground">Loading feeding records from MongoDB...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            ['Feeding Records', records.length, 'Saved nutrition plans'],
            ['Feed Types', feedTypes, 'Different feed varieties'],
            ['Daily Schedules', dailySchedules, 'Animals with daily feeding plans']
          ].map(([title, value, description]) => (
            <div key={title} className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-2">{title}</h2>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">{currentRecord ? 'Edit Feeding Record' : 'Add Feeding Record'}</h2>
              {!animals.length && <p role="alert" className="mb-4 text-sm text-destructive">Add an animal before creating a feeding record.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="feeding-animal" className="block text-sm font-medium mb-1">Animal</label>
                  <select id="feeding-animal" value={formData.animal} onChange={(event) => setFormData((current) => ({ ...current, animal: event.target.value }))} required disabled={!animals.length} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select an animal</option>
                    {animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.tagId} - {animal.species}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="feeding-type" className="block text-sm font-medium mb-1">Feed Type</label>
                  <input id="feeding-type" value={formData.feedType} onChange={(event) => setFormData((current) => ({ ...current, feedType: event.target.value }))} required maxLength="50" className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                </div>
                <div>
                  <label htmlFor="feeding-quantity" className="block text-sm font-medium mb-1">Quantity</label>
                  <input id="feeding-quantity" type="number" value={formData.quantity} onChange={(event) => setFormData((current) => ({ ...current, quantity: event.target.value }))} required min="0" step="0.1" className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                </div>
                <div>
                  <label htmlFor="feeding-unit" className="block text-sm font-medium mb-1">Unit</label>
                  <select id="feeding-unit" value={formData.unit} onChange={(event) => setFormData((current) => ({ ...current, unit: event.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    {['kg', 'lbs', 'grams', 'liters', 'ml'].map((unit) => <option key={unit}>{unit}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="feeding-frequency" className="block text-sm font-medium mb-1">Frequency</label>
                  <select id="feeding-frequency" value={formData.frequency} onChange={(event) => setFormData((current) => ({ ...current, frequency: event.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    {['daily', 'weekly', 'monthly', 'as needed'].map((frequency) => <option key={frequency}>{frequency}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="feeding-notes" className="block text-sm font-medium mb-1">Notes</label>
                  <textarea id="feeding-notes" value={formData.notes} onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))} rows="3" maxLength="500" className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-input rounded-md hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving || !animals.length} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-60">{saving ? 'Saving...' : currentRecord ? 'Update Record' : 'Add Record'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
