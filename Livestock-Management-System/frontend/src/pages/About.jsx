export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Livestock Manager</h1>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg mb-6">
            Livestock Manager is a comprehensive platform designed to help farmers and livestock owners 
            efficiently manage their herds. Our system provides tools to track animal health, vaccination 
            schedules, feeding routines, and ownership details all in one place.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            We aim to simplify livestock management by providing an intuitive, feature-rich platform 
            that helps farmers make informed decisions about their herds. Our goal is to improve 
            productivity, animal welfare, and farm profitability through technology.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Benefits for Farmers</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Centralized animal records for easy access and management</li>
            <li>Automated vaccination reminders to ensure animal health</li>
            <li>Feeding schedule tracking for optimal nutrition</li>
            <li>Detailed reporting and analytics for informed decision-making</li>
            <li>Secure data storage with role-based access controls</li>
            <li>Mobile-friendly interface for on-the-go management</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
          <p>
            Our platform combines ease of use with powerful features, making livestock management 
            accessible to farmers of all technical skill levels. With real-time data synchronization, 
            customizable alerts, and comprehensive reporting tools, Livestock Manager is the ultimate 
            solution for modern livestock farming.
          </p>
        </div>
      </div>
    </div>
  )
}