import { useState } from 'react'
import { MoonIcon, SunIcon, MenuIcon, SearchIcon, XIcon } from 'lucide-react'

export default function TopNavbar({ sidebarOpen, setSidebarOpen, toggleTheme, theme }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

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
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearch} className="relative hidden md:block">
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
            onClick={toggleTheme}
            className="p-2 rounded-md text-foreground hover:bg-muted"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          <div className="ml-4 relative">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="px-4 pb-4 md:hidden">
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
    </header>
  )
}