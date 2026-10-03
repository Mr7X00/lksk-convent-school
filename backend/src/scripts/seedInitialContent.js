/**
 * Seed script for initial content-heavy sections:
 * - Gallery Albums & Photos
 * - Faculty across all 5 categories
 * - Topper Students across sessions
 * - Student Achievements across 6 categories
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const {
  Staff,
  Topper,
  Achievement,
  GalleryAlbum,
  GalleryImage,
  HeroSlide,
} = require('../models');

async function seedContent() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lksk_school';
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection established.');

    // 1. Seed Gallery Albums & Photos
    console.log('Seeding Gallery Albums...');
    const existingAlbums = await GalleryAlbum.countDocuments();
    if (existingAlbums === 0) {
      const albumsData = [
        {
          title: 'Annual Sports Meet & Athletic Championship',
          slug: 'annual-sports-meet',
          category: 'Sports',
          description: 'Moments of track events, relay sprints, march past, and trophy presentations.',
          coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
          displayOrder: 1,
          isActive: true,
        },
        {
          title: 'Annual Day Cultural Gala & Felicitation',
          slug: 'annual-cultural-day',
          category: 'Annual Functions',
          description: 'Dramatic theatre performances, classical dances, music choir, and academic honors.',
          coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
          displayOrder: 2,
          isActive: true,
        },
        {
          title: 'Science & Robotics Discovery Fair',
          slug: 'science-robotics-fair',
          category: 'Academic & Science',
          description: 'Live student inventions, automated irrigation models, hydraulic arms, and eco prototypes.',
          coverImageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
          displayOrder: 3,
          isActive: true,
        },
        {
          title: '77th Independence Day Flag Hoisting',
          slug: 'independence-day-celebration',
          category: 'Celebrations',
          description: 'Ceremonial tricolor unfurling, national anthem recitation, parade, and student speeches.',
          coverImageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
          displayOrder: 4,
          isActive: true,
        },
      ];

      for (const aData of albumsData) {
        const album = await GalleryAlbum.create(aData);
        // Add sample photos to album
        await GalleryImage.create([
          {
            albumId: album._id,
            title: `${album.title} - Highlight 1`,
            imageUrl: album.coverImageUrl,
            caption: 'Opening ceremony and ceremonial inaugural salute.',
            displayOrder: 1,
            isActive: true,
          },
          {
            albumId: album._id,
            title: `${album.title} - Highlight 2`,
            imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
            caption: 'Students engaged in active performance and participation.',
            displayOrder: 2,
            isActive: true,
          },
          {
            albumId: album._id,
            title: `${album.title} - Highlight 3`,
            imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
            caption: 'Distinguished guests and faculty congratulating student champions.',
            displayOrder: 3,
            isActive: true,
          },
        ]);
      }
      console.log('✓ Gallery albums and photos seeded.');
    } else {
      console.log('Gallery albums already populated, skipping.');
    }

    // 2. Seed Faculty across all 5 categories
    console.log('Seeding Faculty Directory...');
    const existingStaff = await Staff.countDocuments();
    if (existingStaff === 0) {
      await Staff.create([
        {
          name: 'Dr. R. K. Srivastava',
          category: 'PGT',
          designation: 'Senior PGT Physics & Head of Science',
          subject: 'Physics & STEM',
          qualification: 'Ph.D., M.Sc. (Physics), B.Ed.',
          experienceYears: 14,
          displayOrder: 1,
          isActive: true,
        },
        {
          name: 'Shri Vikram Singh',
          category: 'PGT',
          designation: 'PGT English & Literary In-Charge',
          subject: 'English Core & Elective',
          qualification: 'M.A. (English), B.Ed.',
          experienceYears: 11,
          displayOrder: 2,
          isActive: true,
        },
        {
          name: 'Smt. Anjali Sharma',
          category: 'TGT',
          designation: 'TGT Mathematics Specialist',
          subject: 'Mathematics',
          qualification: 'M.Sc. (Maths), B.Ed.',
          experienceYears: 9,
          displayOrder: 3,
          isActive: true,
        },
        {
          name: 'Dr. Meena Pandey',
          category: 'TGT',
          designation: 'TGT Hindi & Sanskrit Scholar',
          subject: 'Hindi & Classical Sanskrit',
          qualification: 'Ph.D., M.A. (Hindi), B.Ed.',
          experienceYears: 13,
          displayOrder: 4,
          isActive: true,
        },
        {
          name: 'Shri Amit Kumar Verma',
          category: 'Other Teaching Staff',
          designation: 'Computer & AI Instructor',
          subject: 'Computer Science & ICT',
          qualification: 'MCA, B.Sc. (IT)',
          experienceYears: 7,
          displayOrder: 5,
          isActive: true,
        },
        {
          name: 'Smt. Sunita Tiwari',
          category: 'Other Teaching Staff',
          designation: 'Primary Wing Coordinator',
          subject: 'Foundational Literacy & Numeracy',
          qualification: 'M.A., N.T.T., B.Ed.',
          experienceYears: 10,
          displayOrder: 6,
          isActive: true,
        },
        {
          name: 'Shri Rajesh Yadav',
          category: 'Other Teaching Staff',
          designation: 'Physical Education Director',
          subject: 'Sports, Athletics & Yoga',
          qualification: 'M.P.Ed., B.P.Ed.',
          experienceYears: 12,
          displayOrder: 7,
          isActive: true,
        },
        {
          name: 'Shri D. P. Singh',
          category: 'Administrative Staff',
          designation: 'Senior Administrative Officer',
          subject: '',
          qualification: 'M.Com, PGDCA',
          experienceYears: 16,
          displayOrder: 8,
          isActive: true,
        },
        {
          name: 'Shri Manoj Kumar',
          category: 'Support Staff',
          designation: 'Senior Campus Supervisor',
          subject: '',
          qualification: 'Senior Secondary',
          experienceYears: 8,
          displayOrder: 9,
          isActive: true,
        },
      ]);
      console.log('✓ Faculty records seeded.');
    } else {
      console.log('Faculty records already populated, skipping.');
    }

    // 3. Seed Topper Students
    console.log('Seeding Topper Students...');
    const existingToppers = await Topper.countDocuments();
    if (existingToppers === 0) {
      await Topper.create([
        {
          studentName: 'Ananya Kumar',
          classGrade: 'Class 10',
          examType: 'Class 10',
          percentageOrScore: '98.6%',
          academicYear: '2025-2026',
          achievement: 'District Rank 1 / School Board Topper',
          displayOrder: 1,
          isActive: true,
        },
        {
          studentName: 'Saurabh Mishra',
          classGrade: 'Class 12',
          examType: 'Class 12',
          stream: 'Science',
          percentageOrScore: '97.4%',
          academicYear: '2025-2026',
          achievement: 'District Rank 2 / School Science Stream Topper',
          displayOrder: 2,
          isActive: true,
        },
        {
          studentName: 'Priya Srivastava',
          classGrade: 'Class 10',
          examType: 'Class 10',
          percentageOrScore: '96.8%',
          academicYear: '2025-2026',
          achievement: 'School Rank 2 (All Subjects Distinction)',
          displayOrder: 3,
          isActive: true,
        },
        {
          studentName: 'Aditya Tiwari',
          classGrade: 'Class 12',
          examType: 'Class 12',
          stream: 'Science',
          percentageOrScore: '96.2%',
          academicYear: '2024-2025',
          achievement: 'Regional Merit Certificate Holder',
          displayOrder: 4,
          isActive: true,
        },
        {
          studentName: 'Sneha Pandey',
          classGrade: 'Class 12',
          examType: 'Class 12',
          stream: 'Commerce',
          percentageOrScore: '95.5%',
          academicYear: '2024-2025',
          achievement: 'Commerce Stream High Distinction',
          displayOrder: 5,
          isActive: true,
        },
        {
          studentName: 'Rohan Verma',
          classGrade: 'Class 10',
          examType: 'Class 10',
          percentageOrScore: '95.8%',
          academicYear: '2024-2025',
          achievement: 'Perfect 100 in Mathematics & Science',
          displayOrder: 6,
          isActive: true,
        },
      ]);
      console.log('✓ Topper students seeded.');
    } else {
      console.log('Topper students already populated, skipping.');
    }

    // 4. Seed Achievements
    console.log('Seeding Student Achievements...');
    const existingAchievements = await Achievement.countDocuments();
    if (existingAchievements === 0) {
      await Achievement.create([
        {
          title: 'District Science Exhibition Champion',
          achievement: 'District Science Exhibition Champion',
          student: 'Aman Verma & Team',
          recipient: 'Aman Verma & Team',
          studentClass: 'Class 9',
          event: 'Ayodhya District STEM Expo 2026',
          year: '2026',
          category: 'Academic',
          description: 'Awarded 1st place in Ayodhya for solar-powered automated irrigation prototype.',
          displayOrder: 1,
          isFeatured: true,
          isActive: true,
        },
        {
          title: 'State Athletics Championship (Silver)',
          achievement: 'State Athletics Championship (Silver)',
          student: 'Vikram Pratap',
          recipient: 'Vikram Pratap',
          studentClass: 'Class 11',
          event: 'UP State Inter-School Athletics Meet',
          year: '2026',
          category: 'Sports',
          description: 'Silver medal in 400m junior sprint against 32 regional schools.',
          displayOrder: 2,
          isFeatured: true,
          isActive: true,
        },
        {
          title: 'Inter-School Hindi Debate Trophy',
          achievement: 'Inter-School Hindi Debate Trophy',
          student: 'Megha Shukla',
          recipient: 'Megha Shukla',
          studentClass: 'Class 10',
          event: 'Sohawal Inter-School Literary Cup',
          year: '2026',
          category: 'Cultural',
          description: 'Winner of the Annual Regional Debate Contest on moral education.',
          displayOrder: 3,
          isFeatured: true,
          isActive: true,
        },
        {
          title: 'National Cyber Olympiad Gold Medalist',
          achievement: 'National Cyber Olympiad Gold Medalist',
          student: 'Ayush Singh',
          recipient: 'Ayush Singh',
          studentClass: 'Class 8',
          event: 'National Cyber & Logic Olympiad',
          year: '2025',
          category: 'Competitions',
          description: 'Gold merit certificate for outstanding algorithmic reasoning score.',
          displayOrder: 4,
          isFeatured: false,
          isActive: true,
        },
        {
          title: 'District Cricket Championship Runner-up',
          achievement: 'District Cricket Championship Runner-up',
          student: 'School Senior Cricket XI',
          recipient: 'School Senior Cricket XI',
          studentClass: 'Senior Wing',
          event: 'Ayodhya Interschool Cricket Trophy',
          year: '2025',
          category: 'Sports',
          description: 'School cricket XI reached the tournament finals with 4 consecutive victories.',
          displayOrder: 5,
          isFeatured: false,
          isActive: true,
        },
        {
          title: 'Annual Art & Folk Origami First Prize',
          achievement: 'Annual Art & Folk Origami First Prize',
          student: 'Sneha Pandey',
          recipient: 'Sneha Pandey',
          studentClass: 'Class 7',
          event: 'Regional Visual Arts Festival',
          year: '2025',
          category: 'Creative',
          description: 'Celebrated for complex geometrical paper sculpture depicting Indian heritage.',
          displayOrder: 6,
          isFeatured: false,
          isActive: true,
        },
      ]);
      console.log('✓ Student achievements seeded.');
    } else {
      console.log('Achievements already populated, skipping.');
    }

    // 5. Seed Hero Slides for Homepage Carousel
    console.log('Seeding Hero Slides...');
    const existingHero = await HeroSlide.countDocuments();
    if (existingHero === 0) {
      await HeroSlide.create([
        {
          title: 'L.K.S.K Convent School',
          subtitle: 'Nurturing scholarly excellence, moral fortitude, and visionary leadership in Panditpur, Sohawal, Ayodhya.',
          imageUrl: '/assets/hero/slide-campus.jpg',
          ctaText: 'Admission Inquiry',
          ctaLink: '/academic/admission-inquiry/',
          displayOrder: 1,
          isActive: true,
        },
        {
          title: 'Smart Digital Classrooms',
          subtitle: 'Engaging interactive boards and individual academic mentoring empowering students to conceptualize deeper.',
          imageUrl: '/assets/hero/slide-classroom.jpg',
          ctaText: 'Explore Classrooms',
          ctaLink: '/campus/classrooms/',
          displayOrder: 2,
          isActive: true,
        },
        {
          title: 'Central Library & Resource Hub',
          subtitle: 'An inspiring sanctuary featuring 5,000+ volumes, scholarly journals, reference manuals, and peaceful reading carrels.',
          imageUrl: '/assets/hero/slide-library.jpg',
          ctaText: 'Explore Library',
          ctaLink: '/campus/library/',
          displayOrder: 3,
          isActive: true,
        },
        {
          title: 'Advanced Science & Computer Labs',
          subtitle: 'State-of-the-art physics, chemistry, biology, and high-speed computer laboratories promoting empirical discovery.',
          imageUrl: '/assets/hero/slide-lab.jpg',
          ctaText: 'Explore Laboratories',
          ctaLink: '/campus/science-lab/',
          displayOrder: 4,
          isActive: true,
        },
        {
          title: 'Athletic Fields & Co-Curriculars',
          subtitle: 'Sprawling outdoor sports arena, specialized pitch, indoor games hall, and multifaceted holistic development.',
          imageUrl: '/assets/hero/slide-sports.jpg',
          ctaText: 'Campus Facilities',
          ctaLink: '/campus/playground/',
          displayOrder: 5,
          isActive: true,
        },
      ]);
      console.log('✓ Hero slides seeded.');
    } else {
      console.log('Hero slides already populated, skipping.');
    }

    console.log('\nAll content-heavy section seeds finished successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedContent();
