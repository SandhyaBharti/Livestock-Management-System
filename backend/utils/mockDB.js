// Mock database for demonstration purposes
let users = []
let owners = []
let animals = []
let vaccinations = []
let nutritionRecords = []

let userIdCounter = 1
let ownerIdCounter = 1
let animalIdCounter = 1
let vaccinationIdCounter = 1
let nutritionIdCounter = 1

// Users
const createUser = (userData) => {
  const user = { id: userIdCounter++, ...userData }
  users.push(user)
  return user
}

const findUserByEmail = (email) => {
  return users.find(user => user.email === email)
}

const findUserById = (id) => {
  return users.find(user => user.id === id)
}

// Owners
const createOwner = (ownerData) => {
  const owner = { id: ownerIdCounter++, ...ownerData }
  owners.push(owner)
  return owner
}

const findAllOwners = () => {
  return owners
}

const findOwnerById = (id) => {
  return owners.find(owner => owner.id === id)
}

const updateOwner = (id, ownerData) => {
  const index = owners.findIndex(owner => owner.id === id)
  if (index !== -1) {
    owners[index] = { ...owners[index], ...ownerData }
    return owners[index]
  }
  return null
}

const deleteOwner = (id) => {
  const index = owners.findIndex(owner => owner.id === id)
  if (index !== -1) {
    owners.splice(index, 1)
    return true
  }
  return false
}

// Animals
const createAnimal = (animalData) => {
  const animal = { id: animalIdCounter++, ...animalData }
  animals.push(animal)
  return animal
}

const findAllAnimals = () => {
  return animals
}

const findAnimalById = (id) => {
  return animals.find(animal => animal.id === id)
}

const updateAnimal = (id, animalData) => {
  const index = animals.findIndex(animal => animal.id === id)
  if (index !== -1) {
    animals[index] = { ...animals[index], ...animalData }
    return animals[index]
  }
  return null
}

const deleteAnimal = (id) => {
  const index = animals.findIndex(animal => animal.id === id)
  if (index !== -1) {
    animals.splice(index, 1)
    return true
  }
  return false
}

// Vaccinations
const createVaccination = (vaccinationData) => {
  const vaccination = { id: vaccinationIdCounter++, ...vaccinationData }
  vaccinations.push(vaccination)
  return vaccination
}

const findAllVaccinations = () => {
  return vaccinations
}

const findVaccinationById = (id) => {
  return vaccinations.find(vaccination => vaccination.id === id)
}

const updateVaccination = (id, vaccinationData) => {
  const index = vaccinations.findIndex(vaccination => vaccination.id === id)
  if (index !== -1) {
    vaccinations[index] = { ...vaccinations[index], ...vaccinationData }
    return vaccinations[index]
  }
  return null
}

const deleteVaccination = (id) => {
  const index = vaccinations.findIndex(vaccination => vaccination.id === id)
  if (index !== -1) {
    vaccinations.splice(index, 1)
    return true
  }
  return false
}

// Nutrition Records
const createNutritionRecord = (nutritionData) => {
  const nutrition = { id: nutritionIdCounter++, ...nutritionData }
  nutritionRecords.push(nutrition)
  return nutrition
}

const findAllNutritionRecords = () => {
  return nutritionRecords
}

const findNutritionRecordById = (id) => {
  return nutritionRecords.find(nutrition => nutrition.id === id)
}

const updateNutritionRecord = (id, nutritionData) => {
  const index = nutritionRecords.findIndex(nutrition => nutrition.id === id)
  if (index !== -1) {
    nutritionRecords[index] = { ...nutritionRecords[index], ...nutritionData }
    return nutritionRecords[index]
  }
  return null
}

const deleteNutritionRecord = (id) => {
  const index = nutritionRecords.findIndex(nutrition => nutrition.id === id)
  if (index !== -1) {
    nutritionRecords.splice(index, 1)
    return true
  }
  return false
}

// Reset database
const resetDatabase = () => {
  users = []
  owners = []
  animals = []
  vaccinations = []
  nutritionRecords = []
  
  userIdCounter = 1
  ownerIdCounter = 1
  animalIdCounter = 1
  vaccinationIdCounter = 1
  nutritionIdCounter = 1
}

module.exports = {
  // Users
  createUser,
  findUserByEmail,
  findUserById,
  
  // Owners
  createOwner,
  findAllOwners,
  findOwnerById,
  updateOwner,
  deleteOwner,
  
  // Animals
  createAnimal,
  findAllAnimals,
  findAnimalById,
  updateAnimal,
  deleteAnimal,
  
  // Vaccinations
  createVaccination,
  findAllVaccinations,
  findVaccinationById,
  updateVaccination,
  deleteVaccination,
  
  // Nutrition Records
  createNutritionRecord,
  findAllNutritionRecords,
  findNutritionRecordById,
  updateNutritionRecord,
  deleteNutritionRecord,
  
  // Reset
  resetDatabase
}