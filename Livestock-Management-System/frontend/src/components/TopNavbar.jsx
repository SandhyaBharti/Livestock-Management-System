import { useState } from 'react'
import { MoonIcon, SunIcon, MenuIcon, SearchIcon, XIcon, UserRound } from 'lucide-react'
import { apiRequest } from '../utils/api'
import { getCurrentUser, saveCurrentUser } from '../utils/auth'

export default function TopNavbar({ sidebarOpen, setSidebarOpen, toggleTheme, theme }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [user, setUser] = useState(getCurrentUser)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const openProfileEditor = () => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' })
    setProfileError('')
    setShowProfileMenu(false)
    setShowProfileEditor(true)
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    setProfileError('')
    try {
      const { data } = await apiRequest('/auth/me', {
        method: 'PUT',
        body: profileForm
      })
      saveCurrentUser(data)
      setUser(data)
      setShowProfileEditor(false)
    } catch (requestError) {
      setProfileError(requestError.message)
    } finally {
      setSavingProfile(false)
    }
  }

  // Mock search function - in a real app, this would call your API
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Mock search results
    if (searchQuery.trim() !== '') {
      const mockResults = [
        { id: 1, type: 'owner', name: `Owner: John Doe (${searchQuery})`, link: '/dashboard/owners' },
        { id: 2, type: 'animal', name: `Animal: Cow #124 (${searchQuery})`, link: '/dashboard/animals' },
        { id: 3, type: 'vaccination', name: `Vaccination: Brucellosis Vaccine (${searchQuery})`, link: '/dashboard/vaccinations' },
        { id: 4, type: 'feeding', name: `Feeding: Hay for Cow #124 (${searchQuery})`, link: '/dashboard/feeding' }
      ]
      setSearchResults(mockResults)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  return (
    <header className="dashboard-navbar bg-card border-b border-border">
      <div className="dashboard-navbar-row flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="navbar-menu-button mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          
          <form onSubmit={handleSearch} className="navbar-desktop-search relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search owners, animals, vaccinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XIcon className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="px-4 py-2 text-sm hover:bg-muted cursor-pointer"
                    onClick={() => {
                      clearSearch()
                      // In a real app, you would navigate to the result
                      console.log('Navigating to:', result.link)
                    }}
                  >
                    {result.name}
                  </div>
                ))}
                <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                  {searchResults.length} results found
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="p-2 rounded-md text-foreground hover:bg-muted"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          <div className="navbar-avatar ml-4 relative">
            <button
              type="button"
              className="navbar-profile-button"
              aria-label="Open user profile"
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu((visible) => !visible)}
            >
              <span className="navbar-profile-initial">{user?.name?.trim()?.[0]?.toUpperCase() || <UserRound className="h-4 w-4" />}</span>
              <span className="navbar-profile-name">{user?.name || 'Profile'}</span>
            </button>
            {showProfileMenu && (
              <div className="navbar-profile-menu">
                <p className="navbar-profile-menu-name">{user?.name || 'User'}</p>
                <p className="navbar-profile-menu-email">{user?.email}</p>
                <p className="navbar-profile-menu-role">{user?.role === 'admin' ? 'Administrator' : 'Farm user'}</p>
                <button type="button" onClick={openProfileEditor}>Edit profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="navbar-mobile-search px-4 pb-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search owners, animals, vaccinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Mobile Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-2 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="px-4 py-2 text-sm hover:bg-muted cursor-pointer"
                  onClick={() => {
                    clearSearch()
                    // In a real app, you would navigate to the result
                    console.log('Navigating to:', result.link)
                  }}
                >
                  {result.name}
                </div>
              ))}
              <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                {searchResults.length} results found
              </div>
            </div>
          )}
        </form>
      </div>

      {showProfileEditor && (
        <div className="profile-modal-backdrop" onClick={() => setShowProfileEditor(false)}>
          <form
            className="profile-modal"
            onSubmit={handleProfileSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-heading">
              <div className="owner-details-profile-icon" aria-hidden="true"><UserRound className="h-6 w-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Your profile</h2>
                <p className="text-sm text-muted-foreground">Update the name and email saved to your account</p>
              </div>
            </div>
            {profileError && <p role="alert" className="profile-error">{profileError}</p>}
            <label htmlFor="profile-name">Full name</label>
            <input
              id="profile-name"
              name="name"
              value={profileForm.name}
              onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
              required
              maxLength="50"
            />
            <label htmlFor="profile-email">Email address</label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
            <div className="profile-modal-actions">
              <button type="button" onClick={() => setShowProfileEditor(false)}>Cancel</button>
              <button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</button>
            </div>
          </form>
        </div>
      )}
    </header>
  )
}