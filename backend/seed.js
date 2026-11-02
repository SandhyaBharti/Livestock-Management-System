require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Owner = require('./models/Owner');
const Animal = require('./models/Animal');
const Vaccination = require('./models/Vaccination');
const Nutrition = require('./models/Nutrition');

const upsertSample = async (Model, filter, document) => Model.findOneAndUpdate(
  filter,
  { $setOnInsert: document },
  { new: true, upsert: true, runValidators: true }
);

const seed = async () => {
  await connectDB();

  let admin = await User.findOne({ email: 'admin@livestock.com' }).select('+password');
  if (!admin) {
    admin = await User.create({
      name: 'Livestock Admin',
      email: 'admin@livestock.com',
      password: 'Admin@123',
      role: 'admin'
    });
  } else {
    admin.name = 'Livestock Admin';
    admin.password = 'Admin@123';
    admin.role = 'admin';
    await admin.save();
  }

  const ownerSamples = [
    {
      firstName: 'Sample',
      lastName: 'Owner',
      email: 'sample.owner@livestock.com',
      phone: '5550101000',
      address: {
        street: '1 Farm Road',
        city: 'Greenfield',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      }
    },
    {
      firstName: 'Jordan',
      lastName: 'Farmer',
      email: 'jordan.farmer@livestock.com',
      phone: '5550101001',
      address: {
        street: '2 Pasture Lane',
        city: 'Meadowville',
        state: 'CA',
        zipCode: '90002',
        country: 'USA'
      }
    }
  ];

  const owners = [];
  for (const sample of ownerSamples) {
    owners.push(await upsertSample(
      Owner,
      { email: sample.email },
      { ...sample, user: admin._id }
    ));
  }

  const animalSamples = [
    { tagId: 'DEMO-COW-001', species: 'Cattle', breed: 'Holstein', age: 3, owner: owners[0]._id },
    { tagId: 'DEMO-COW-002', species: 'Cattle', breed: 'Jersey', age: 4, owner: owners[0]._id },
    { tagId: 'DEMO-SHEEP-001', species: 'Sheep', breed: 'Merino', age: 2, owner: owners[1]._id }
  ];

  const animals = [];
  for (const sample of animalSamples) {
    animals.push(await upsertSample(
      Animal,
      { tagId: sample.tagId },
      { ...sample, user: admin._id }
    ));
  }

  for (const [index, animal] of animals.entries()) {
    const vaccinationDate = new Date();
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 14 + index);
    await upsertSample(
      Vaccination,
      { animal: animal._id, vaccineName: 'Annual Booster' },
      {
        animal: animal._id,
        vaccineName: 'Annual Booster',
        vaccinationDate,
        nextDueDate,
        notes: 'Sample vaccination record',
        user: admin._id
      }
    );
    await upsertSample(
      Nutrition,
      { animal: animal._id, feedType: 'Hay' },
      {
        animal: animal._id,
        feedType: 'Hay',
        quantity: 8,
        unit: 'kg',
        frequency: 'daily',
        notes: 'Sample feeding record',
        user: admin._id
      }
    );
  }

  console.log('Seed complete. Admin login: admin@livestock.com / Admin@123');
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(`Seed failed: ${error.message}`);
  await mongoose.connection.close();
  process.exitCode = 1;
});
