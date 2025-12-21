# Livestock Manager

A comprehensive platform for managing livestock farms built with the MERN stack (MongoDB, Express.js, React, Node.js) and ShadCN UI components.

## Features

- **Authentication System**: JWT-based authentication with role-based access control (Admin/User)
- **Dashboard**: Card-based dashboard with analytics and recent activity
- **Owner Management**: Add, view, edit, and delete livestock owners
- **Animal Tracking**: Manage animal details including species, breed, and age
- **Vaccination Management**: Record and track vaccination schedules
- **Feeding Schedules**: Manage feeding routines and nutritional requirements
- **Analytics**: Visual charts for vaccination coverage and animal distribution
- **Global Search**: Search across all entities
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Default dark theme with theme toggle

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing
- express-validator for input validation

### Frontend
- React 18
- React Router v6
- ShadCN UI components
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd livestock_manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

## Running the Application

### Development Mode

From the root directory:
```bash
npm run dev
```

This will start both the backend and frontend servers concurrently.

Alternatively, you can start them separately:

Backend:
```bash
npm run backend
```

Frontend:
```bash
npm run frontend
```

### Production Mode

Build the frontend:
```bash
cd frontend
npm run build
```

Start the backend server:
```bash
cd ../backend
npm start
```

## Project Structure

```
livestock_manager/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Owners
- `GET /api/v1/owners` - Get all owners
- `GET /api/v1/owners/:id` - Get single owner
- `POST /api/v1/owners` - Create new owner
- `PUT /api/v1/owners/:id` - Update owner
- `DELETE /api/v1/owners/:id` - Delete owner

### Animals
- `GET /api/v1/animals` - Get all animals
- `GET /api/v1/animals/:id` - Get single animal
- `POST /api/v1/animals` - Create new animal
- `PUT /api/v1/animals/:id` - Update animal
- `DELETE /api/v1/animals/:id` - Delete animal

### Vaccinations
- `GET /api/v1/vaccinations` - Get all vaccinations
- `GET /api/v1/vaccinations/:id` - Get single vaccination
- `POST /api/v1/vaccinations` - Create new vaccination
- `PUT /api/v1/vaccinations/:id` - Update vaccination
- `DELETE /api/v1/vaccinations/:id` - Delete vaccination

### Nutrition
- `GET /api/v1/nutrition` - Get all nutrition records
- `GET /api/v1/nutrition/:id` - Get single nutrition record
- `POST /api/v1/nutrition` - Create new nutrition record
- `PUT /api/v1/nutrition/:id` - Update nutrition record
- `DELETE /api/v1/nutrition/:id` - Delete nutrition record

## License

This project is licensed under the MIT License.