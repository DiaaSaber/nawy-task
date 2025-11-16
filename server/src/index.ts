import dotenv from 'dotenv';
import createApp from './app';
import sequelize from './config/database';
import Apartment from './models/Apartment';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Seed function to populate initial data
const seedApartments = async (): Promise<void> => {
  const count = await Apartment.count();
  
  if (count === 0) {
    console.log('Seeding apartments...');
    
    const sampleApartments = [
      {
        project: 'Palm Hills',
        unit_name: 'A-101',
        unit_number: '101',
        price: 1500000,
        area: 120,
        city: 'Cairo',
        description: 'Luxurious apartment with garden view in a prime location',
        status: 'available' as const,
      },
      {
        project: 'Madinaty',
        unit_name: 'B-205',
        unit_number: '205',
        price: 2200000,
        area: 150,
        city: 'Cairo',
        description: 'Spacious apartment with modern finishes and balcony',
        status: 'available' as const,
      },
      {
        project: 'Zayed Dunes',
        unit_name: 'C-302',
        unit_number: '302',
        price: 1800000,
        area: 135,
        city: 'Giza',
        description: 'Contemporary design with smart home features',
        status: 'sold' as const,
      },
      {
        project: 'North Edge Towers',
        unit_name: 'D-410',
        unit_number: '410',
        price: 3000000,
        area: 180,
        city: 'Alexandria',
        description: 'Premium penthouse with sea view and private terrace',
        status: 'reserved' as const,
      },
      {
        project: 'Palm Hills',
        unit_name: 'E-102',
        unit_number: '102',
        price: 1350000,
        area: 110,
        city: 'Cairo',
        description: 'Cozy apartment perfect for small families',
        status: 'available' as const,
      },
    ];
    
    await Apartment.bulkCreate(sampleApartments);
    console.log('Seeded 5 sample apartments.');
  } else {
    console.log(`Database already has ${count} apartment(s). Skipping seed.`);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models
    await sequelize.sync();
    console.log('Database synchronized.');
    
    // Seed data
    await seedApartments();
    
    // Create Express app
    const app = createApp();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints:`);
      console.log(`  - Health: http://localhost:${PORT}/api/health`);
      console.log(`  - Apartments: http://localhost:${PORT}/api/apartments`);
      console.log(`  - Swagger docs: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
