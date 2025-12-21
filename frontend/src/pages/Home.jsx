import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/livestock_manager_img/home.jpeg')" }}>
      <div className="bg-background/80 backdrop-blur-sm min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Livestock Manager</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Efficiently manage your livestock with our comprehensive platform. Track animals, vaccinations, feeding schedules, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/admin-login" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Admin Login
              </Link>
              <Link 
                to="/user-login" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium transition-colors"
              >
                User Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Animal Tracking</h3>
                <p>Keep detailed records of all your livestock including breed, age, and health information.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Vaccination Management</h3>
                <p>Track vaccination schedules and receive reminders for upcoming vaccinations.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Feeding Schedules</h3>
                <p>Manage feeding routines and nutritional requirements for optimal livestock health.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of livestock owners who trust our platform to manage their herds efficiently.
            </p>
            <Link 
              to="/contact" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}