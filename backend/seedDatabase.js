/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import Workshop from './models/Workshop.js';
import Registration from './models/Registration.js';
import Feedback from './models/Feedback.js';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Workshop.deleteMany({});
    await Registration.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student',
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'instructor',
      },
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        fullName: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'student',
      },
    ]);
    console.log('✅ Created 4 users');

    // Create workshops
    const workshops = await Workshop.create([
      {
        title: 'React Advanced Patterns',
        description: 'Learn advanced patterns and best practices in React development',
        category: 'Technology',
        instructor: users[1]._id,
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-20'),
        duration: 40,
        maxParticipants: 30,
        price: 99.99,
        location: 'Online',
        status: 'published',
      },
      {
        title: 'Node.js Backend Development',
        description: 'Master backend development with Node.js and Express',
        category: 'Technology',
        instructor: users[1]._id,
        startDate: new Date('2024-12-22'),
        endDate: new Date('2024-12-27'),
        duration: 35,
        maxParticipants: 25,
        price: 89.99,
        location: 'Online',
        status: 'published',
      },
      {
        title: 'Business Strategy 2024',
        description: 'Essential strategies for business growth and success',
        category: 'Business',
        instructor: users[1]._id,
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-01-10'),
        duration: 20,
        maxParticipants: 50,
        price: 149.99,
        location: 'In-Person',
        status: 'published',
      },
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Learn the basics of digital marketing and SEO',
        category: 'Business',
        instructor: users[1]._id,
        startDate: new Date('2025-01-12'),
        endDate: new Date('2025-01-17'),
        duration: 25,
        maxParticipants: 40,
        price: 79.99,
        location: 'Hybrid',
        status: 'published',
      },
      {
        title: 'Creative Writing Workshop',
        description: 'Develop your creative writing skills with professional writers',
        category: 'Creative',
        instructor: users[1]._id,
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-01-25'),
        duration: 15,
        maxParticipants: 20,
        price: 59.99,
        location: 'Online',
        status: 'published',
      },
    ]);
    console.log('✅ Created 5 workshops');

    // Create registrations
    const registrations = await Registration.create([
      {
        userId: users[0]._id,
        workshopId: workshops[0]._id,
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 99.99,
      },
      {
        userId: users[0]._id,
        workshopId: workshops[1]._id,
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 89.99,
      },
      {
        userId: users[3]._id,
        workshopId: workshops[0]._id,
        status: 'attended',
        paymentStatus: 'completed',
        paymentAmount: 99.99,
        attendanceRecord: true,
      },
      {
        userId: users[3]._id,
        workshopId: workshops[2]._id,
        status: 'registered',
        paymentStatus: 'pending',
        paymentAmount: 149.99,
      },
    ]);
    console.log('✅ Created 4 registrations');

    // Create feedback
    const feedback = await Feedback.create([
      {
        userId: users[3]._id,
        workshopId: workshops[0]._id,
        rating: 5,
        comment: 'Excellent course! Very informative and well-structured.',
        categories: {
          contentQuality: 5,
          instructorQuality: 5,
          courseOrganization: 4,
          overallExperience: 5,
        },
        approved: true,
      },
      {
        userId: users[0]._id,
        workshopId: workshops[1]._id,
        rating: 4,
        comment: 'Great content, could use more practical examples.',
        categories: {
          contentQuality: 4,
          instructorQuality: 4,
          courseOrganization: 4,
          overallExperience: 4,
        },
        approved: true,
      },
      {
        userId: users[3]._id,
        workshopId: workshops[2]._id,
        rating: 3,
        comment: 'Good workshop, but needs better time management.',
        categories: {
          contentQuality: 3,
          instructorQuality: 3,
          courseOrganization: 2,
          overallExperience: 3,
        },
        approved: false,
      },
    ]);
    console.log('✅ Created 3 feedback entries');

    // Update workshop with current participants and reviews
    for (let i = 0; i < workshops.length; i++) {
      const registrationCount = registrations.filter(
        (reg) => reg.workshopId.toString() === workshops[i]._id.toString()
      ).length;
      const workshopFeedback = feedback.filter(
        (f) => f.workshopId.toString() === workshops[i]._id.toString()
      );

      workshops[i].currentParticipants = registrationCount;
      workshops[i].reviews = workshopFeedback;

      if (workshopFeedback.length > 0) {
        const avgRating =
          workshopFeedback.reduce((sum, f) => sum + f.rating, 0) /
          workshopFeedback.length;
        workshops[i].rating = avgRating;
      }

      await workshops[i].save();
    }
    console.log('✅ Updated workshops with participants and reviews');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Sample Data Summary:');
    console.log('- Users: 4 (1 instructor, 1 admin, 2 students)');
    console.log('- Workshops: 5');
    console.log('- Registrations: 4');
    console.log('- Feedback: 3');
    console.log('\nYou can now test the API with this sample data.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
