# Livestock Manager

A livestock management platform built with MongoDB, Express, React, and Node.js.

## Features

- **Authentication System**: MongoDB-backed accounts, hashed passwords, JWT authentication, and role-based access control
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

1. Install the project dependencies from the repository root:
```bash
git clone <repository-url>
cd Livestock-Management-System
npm install
```

2. Create `backend/.env` from `backend/.env.example` and set your MongoDB connection:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/livestock
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRE=30d
```
For a local database, start the MongoDB service before running the application. For MongoDB Atlas, use the Atlas connection string for `MONGO_URI` instead.

3. Optionally add an administrator and demonstration records:
```bash
npm run seed --prefix backend
```
Demo administrator login: `admin@livestock.com` / `Admin@123`. New signups create regular user accounts. Each user can manage their own records; administrators can manage all records.

On Windows PowerShell, copy the example file with:
```powershell
Copy-Item backend\.env.example backend\.env
```

If the frontend and API are deployed on separate hosts, set `VITE_API_URL` in the frontend build environment to the API base URL, such as `https://your-api-host/api/v1`.

## Running the Application

### Development Mode

From the root directory:
```bash
npm run dev
```

This starts the API on `http://localhost:5000` and the Vite frontend on `http://localhost:5173`. The frontend proxies `/api` requests to the local backend during development.

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
Livestock-Management-System/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/          # MongoDB/Mongoose schemas
│   ├── routes/
│   ├── server.js
│   └── .env             # Local connection settings; do not commit
├── frontend/
│   ├── src/
│   └── vite.config.js
├── package.json
└── README.md
```

## Where MongoDB data is stored

The database is **not stored inside this project folder**. `backend/config/db.js` connects Mongoose to the URI in `backend/.env` (`MONGO_URI`). The default URI points to a database named `livestock` on the local MongoDB server:

```text
mongodb://127.0.0.1:27017/livestock
```

MongoDB stores its files in the server's configured data directory (`storage.dbPath`), not in the React or backend source folders. The exact local path depends on how MongoDB was installed or started. To ask the running local MongoDB server for the configured path, run:

```powershell
mongosh --eval "db.adminCommand({ getCmdLineOpts: 1 }).parsed.storage.dbPath"
```

The MongoDB server used for this local setup reports `C:\Program Files\MongoDB\Server\8.2\data`. MongoDB manages the underlying files there; it does not necessarily create a human-readable `livestock` subfolder.

With MongoDB Atlas, the records are stored in the selected cloud cluster instead. The backend's `models/` folder contains schema definitions for the MongoDB `users`, `owners`, `animals`, `vaccinations`, and `nutrition` collections; it does not contain the database files. The frontend stores only the login token/profile cache and theme preference in browser storage; account and livestock records are sent to the protected API and saved in MongoDB.

The API is configured in `backend/config/db.js`; set `MONGO_URI` and a private `JWT_SECRET` in `backend/.env`. Do not commit `.env` or database files.

Existing records saved by the old frontend in browser storage are not automatically copied to MongoDB. Re-enter those records in the app or import them separately before removing the old browser data.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update the signed-in user's name and email

### Owners
- `GET /api/v1/owners` - Get all owners
- `GET /api/v1/owners/:id` - Get single owner
- `POST /api/v1/owners` - Create new owner
- `PUT /api/v1/owners/:id` - Update owner
- `DELETE /api/v1/owners/:id` - Delete owner

### Animals
- `GET /api/v1/animals` - Get all animals
- `GET /api/v1/animals/stats/species` - Count animals by species
- `GET /api/v1/animals/:id` - Get single animal
- `POST /api/v1/animals` - Create new animal
- `PUT /api/v1/animals/:id` - Update animal
- `DELETE /api/v1/animals/:id` - Delete animal

### Vaccinations
- `GET /api/v1/vaccinations` - Get all vaccinations
- `GET /api/v1/vaccinations/due?days=30` - Find overdue vaccinations and those due within the next 30 days
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