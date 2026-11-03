import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, UserRound } from 'lucide-react'
import useApiCollection from '../hooks/useApiCollection'

const emptyOwner = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', zipCode: '', country: '' }
}

export default function OwnerDetails() {
  const { items: owners, loading, error, setError, create, update, remove } = useApiCollection('/owners')
  const [showModal, setShowModal] = useState(false)
  const [currentOwner, setCurrentOwner] = useState(null)
  const [formData, setFormData] = useState(emptyOwner)
  const [saving, setSaving] = useState(false)

  const openNewOwner = () => {
    setCurrentOwner(null)
    setFormData(emptyOwner)
    setError('')
    setShowModal(true)
  }

  const editOwner = (owner) => {
    setCurrentOwner(owner)
    setFormData({
      ...emptyOwner,
      ...owner,
      address: { ...emptyOwner.address, ...owner.address }
    })
    setError('')
    setShowModal(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name.startsWith('address.')) {
      const field = name.slice('address.'.length)
      setFormData((current) => ({
        ...current,
        address: { ...current.address, [field]: value }
      }))
    } else {
      setFormData((current) => ({ ...current, [name]: value }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (currentOwner) {
        await update(currentOwner._id, formData)
      } else {
        await create(formData)
      }
      setShowModal(false)
    } catch {
      // The collection hook exposes the API error in the page.
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (owner) => {
    if (!window.confirm(`Delete ${owner.firstName} ${owner.lastName}?`)) return
    try {
      await remove(owner._id)
    } catch {
      // The collection hook exposes the API error in the page.
    }
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
          <button onClick={openNewOwner} className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Owner
          </button>
        </div>

        {error && <p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-destructive">{error}</p>}

        <div className="bg-card owner-details-table rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  {['Name', 'Email', 'Phone', 'Address', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {owners.map((owner) => (
                  <tr key={owner._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{owner.firstName} {owner.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{owner.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{owner.phone}</td>
                    <td className="px-6 py-4 text-sm">{[owner.address?.street, owner.address?.city, owner.address?.state, owner.address?.zipCode, owner.address?.country].filter(Boolean).join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" aria-label={`Edit ${owner.firstName}`} onClick={() => editOwner(owner)} className="text-primary hover:text-primary/80 mr-3"><PencilIcon className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Delete ${owner.firstName}`} onClick={() => handleDelete(owner)} className="text-destructive hover:text-destructive/80"><TrashIcon className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {!loading && owners.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No owners yet. Add an owner to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && <p className="p-4 text-sm text-muted-foreground">Loading owners from MongoDB...</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 owner-details-modal">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto owner-details-dialog">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">{currentOwner ? 'Edit Owner Information' : 'Add Owner'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {[
                      ['firstName', 'First Name', 'text'],
                      ['lastName', 'Last Name', 'text'],
                      ['email', 'Email', 'email'],
                      ['phone', 'Phone', 'tel']
                    ].map(([name, label, type]) => (
                      <div key={name}>
                        <label htmlFor={`owner-${name}`} className="block text-sm font-medium mb-1">{label}</label>
                        <input id={`owner-${name}`} type={type} name={name} value={formData[name]} onChange={handleChange} required className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      ['street', 'Street'],
                      ['city', 'City'],
                      ['state', 'State'],
                      ['zipCode', 'ZIP Code'],
                      ['country', 'Country']
                    ].map(([name, label]) => (
                      <div key={name}>
                        <label htmlFor={`owner-address-${name}`} className="block text-sm font-medium mb-1">{label}</label>
                        <input id={`owner-address-${name}`} name={`address.${name}`} value={formData.address[name]} onChange={handleChange} required className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-input rounded-md hover:bg-muted">Cancel</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-60">{saving ? 'Saving...' : currentOwner ? 'Update Owner' : 'Add Owner'}</button>
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
