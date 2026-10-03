/**
 * Dev In-Memory Content Store for L.K.S.K Convent School CMS
 * Provides robust fallback data and full in-memory CRUD operations
 * when MongoDB daemon is not running locally.
 */

const mongoose = require('mongoose');

function generateId() {
  return new mongoose.Types.ObjectId().toString();
}

const initialAlbums = [
  {
    _id: '660000000000000000000101',
    title: 'Welcome Republic Day Patriotic Art & Celebrations',
    slug: 'republic-day-celebration',
    category: 'Celebrations',
    description: 'A breathtaking traditional rangoli welcoming guests and students to the 76th Republic Day celebrations at L.K.S.K Convent School, embodying national pride, unity, and festive campus spirit.',
    coverImageUrl: '/assets/gallery/republic-day-rangoli.jpg',
    eventDate: new Date('2026-01-26'),
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000102',
    title: 'Junior Scholastic Merit Felicitation',
    slug: 'junior-academic-felicitation',
    category: 'Academic & Science',
    description: 'A proud L.K.G student being honored with the official Academic Excellence Certificate alongside their class educator, celebrating foundational brilliance, discipline, and enthusiastic learning.',
    coverImageUrl: '/assets/gallery/lkg-academic-excellence.jpg',
    eventDate: new Date('2026-02-15'),
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: '660000000000000000000103',
    title: 'Little Chefs Culinary Workshop',
    slug: 'culinary-nutrition-workshop',
    category: 'Campus Life',
    description: 'Enthusiastic students demonstrating culinary creativity and healthy nutrition through fireless sandwich crafting and team plating activities, fostering essential life skills and cooperative camaraderie.',
    coverImageUrl: '/assets/gallery/culinary-activity.jpg',
    eventDate: new Date('2026-02-20'),
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: '660000000000000000000104',
    title: '"Save Our Earth" Environmental Rangoli',
    slug: 'save-earth-rangoli-art',
    category: 'Campus Life',
    description: 'Students and teachers gathered around a magnificent circular floor artwork illustrating environmental balance, inspiring climate stewardship, tree conservation, and sustainable community living.',
    coverImageUrl: '/assets/gallery/rangoli-competition.jpg',
    eventDate: new Date('2026-03-01'),
    displayOrder: 4,
    isActive: true,
  },
  {
    _id: '660000000000000000000105',
    title: 'Maa Saraswati Vandana & Cultural Puja',
    slug: 'cultural-puja-celebration',
    category: 'Celebrations',
    description: 'Faculty members and students participating in sacred invocations to the Goddess of Wisdom, preserving cultural roots, devotion, and character building at L.K.S.K Convent School.',
    coverImageUrl: '/assets/gallery/cultural-puja.jpg',
    eventDate: new Date('2026-02-02'),
    displayOrder: 5,
    isActive: true,
  },
  {
    _id: '660000000000000000000106',
    title: 'Annual Sports Meet & Athletic Championship',
    slug: 'annual-sports-meet',
    category: 'Sports',
    description: 'Track and field sprints, relay races, march pasts, and championship trophies.',
    coverImageUrl: '/assets/hero/slide-sports.jpg',
    eventDate: new Date('2025-12-18'),
    displayOrder: 6,
    isActive: true,
  },
];

const initialGalleryImages = [
  {
    _id: '660000000000000000000201',
    albumId: '660000000000000000000101',
    title: 'Welcome Republic Day Celebrations',
    imageUrl: '/assets/gallery/republic-day-rangoli.jpg',
    caption: 'Welcome Republic Day Celebrations — Vibrant handmade rangoli artwork welcoming students and guests.',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000202',
    albumId: '660000000000000000000102',
    title: 'L.K.G Academic Excellence Certificate Felicitation',
    imageUrl: '/assets/gallery/lkg-academic-excellence.jpg',
    caption: 'Proud young scholar receiving the Academic Excellence Certificate alongside teacher.',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000203',
    albumId: '660000000000000000000102',
    title: 'Senior Scholastic Merit Felicitation',
    imageUrl: '/assets/gallery/academic-excellence.jpg',
    caption: 'Merit certificate presentation recognizing outstanding academic diligence.',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: '660000000000000000000204',
    albumId: '660000000000000000000103',
    title: 'Little Chefs Practical Nutrition Workshop',
    imageUrl: '/assets/gallery/culinary-activity.jpg',
    caption: 'Students happily demonstrating teamwork, food hygiene, and sandwich preparation skills.',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000205',
    albumId: '660000000000000000000104',
    title: 'Save Our Earth Collaborative Environmental Art',
    imageUrl: '/assets/gallery/rangoli-competition.jpg',
    caption: 'Faculty and students gathered around the circular environmental conservation rangoli.',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000206',
    albumId: '660000000000000000000105',
    title: 'Basant Panchami Saraswati Puja Ceremony',
    imageUrl: '/assets/gallery/cultural-puja.jpg',
    caption: 'Auspicious celebrations, traditional prayers, and prasad distribution.',
    displayOrder: 1,
    isActive: true,
  },
];

const initialStaff = [
  {
    _id: '660000000000000000000301',
    name: 'Dr. Rajeshwari Shukla',
    category: 'PGT',
    department: 'Science',
    designation: 'Senior PGT Physics & Head of Science',
    subject: 'Physics & STEM',
    qualification: 'Ph.D., M.Sc. (Physics), B.Ed.',
    experienceYears: 14,
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000302',
    name: 'Shri Vikram Singh',
    category: 'PGT',
    department: 'Humanities',
    designation: 'PGT English & Literary In-Charge',
    subject: 'English Core & Elective',
    qualification: 'M.A. (English), B.Ed.',
    experienceYears: 11,
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: '660000000000000000000303',
    name: 'Smt. Anjali Sharma',
    category: 'TGT',
    department: 'Mathematics',
    designation: 'TGT Mathematics Specialist',
    subject: 'Mathematics',
    qualification: 'M.Sc. (Maths), B.Ed.',
    experienceYears: 9,
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: '660000000000000000000304',
    name: 'Dr. Meena Pandey',
    category: 'TGT',
    department: 'Languages',
    designation: 'TGT Hindi & Sanskrit Scholar',
    subject: 'Hindi & Classical Sanskrit',
    qualification: 'Ph.D., M.A. (Hindi), B.Ed.',
    experienceYears: 13,
    displayOrder: 4,
    isActive: true,
  },
  {
    _id: '660000000000000000000305',
    name: 'Shri Amit Kumar Verma',
    category: 'Other Teaching Staff',
    department: 'Computer Science',
    designation: 'Computer & AI Instructor',
    subject: 'Computer Science & ICT',
    qualification: 'MCA, B.Sc. (IT)',
    experienceYears: 7,
    displayOrder: 5,
    isActive: true,
  },
  {
    _id: '660000000000000000000306',
    name: 'Smt. Sunita Tiwari',
    category: 'Other Teaching Staff',
    department: 'Primary',
    designation: 'Primary Wing Coordinator',
    subject: 'Foundational Literacy & Numeracy',
    qualification: 'M.A., N.T.T., B.Ed.',
    experienceYears: 10,
    displayOrder: 6,
    isActive: true,
  },
  {
    _id: '660000000000000000000307',
    name: 'Shri Rajesh Yadav',
    category: 'Other Teaching Staff',
    department: 'Physical Education',
    designation: 'Physical Education Director',
    subject: 'Sports, Athletics & Yoga',
    qualification: 'M.P.Ed., B.P.Ed.',
    experienceYears: 12,
    displayOrder: 7,
    isActive: true,
  },
  {
    _id: '660000000000000000000308',
    name: 'Smt. Kavita Mishra',
    category: 'Other Teaching Staff',
    department: 'Arts',
    designation: 'Arts, Crafts & Cultural Head',
    subject: 'Visual & Performing Arts',
    qualification: 'B.F.A., Diploma in Traditional Folk Art',
    experienceYears: 8,
    displayOrder: 8,
    isActive: true,
  },
  {
    _id: '660000000000000000000309',
    name: 'Shri Ramesh Chandra Pathak',
    category: 'Administrative Staff',
    department: 'Administration',
    designation: 'Administrative Registrar & Accounts In-Charge',
    subject: 'Office Administration & Accounts',
    qualification: 'M.Com., Tally Certified Professional',
    experienceYears: 16,
    displayOrder: 9,
    isActive: true,
  },
];

const initialToppers = [
  {
    _id: '660000000000000000000401',
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
    _id: '660000000000000000000402',
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
    _id: '660000000000000000000403',
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
    _id: '660000000000000000000404',
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
    _id: '660000000000000000000405',
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
    _id: '660000000000000000000406',
    studentName: 'Rohan Verma',
    classGrade: 'Class 10',
    examType: 'Class 10',
    percentageOrScore: '95.8%',
    academicYear: '2024-2025',
    achievement: 'Perfect 100 in Mathematics & Science',
    displayOrder: 6,
    isActive: true,
  },
];

const initialAchievements = [
  {
    _id: '660000000000000000000501',
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
    _id: '660000000000000000000502',
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
    _id: '660000000000000000000503',
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
    _id: '660000000000000000000504',
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
];

const initialNotices = [
  {
    _id: '660000000000000000000601',
    title: 'Admissions Open for Session 2026–27 (Nursery to Class XII)',
    category: 'Admissions',
    content: 'Registration forms for admission to academic session 2026–27 are now available online and at the administrative counter. Early application is advised.',
    isUrgent: true,
    displayOrder: 1,
    isActive: true,
    publishedAt: new Date(),
  },
  {
    _id: '660000000000000000000602',
    title: 'Annual Board Examination & Final Evaluation Guidelines',
    category: 'Exams',
    content: 'The final examination schedule and admit cards for Classes IX to XII have been issued. Parents are requested to clear all term dues.',
    isUrgent: false,
    displayOrder: 2,
    isActive: true,
    publishedAt: new Date(),
  },
  {
    _id: '660000000000000000000603',
    title: 'Inter-House Sports Meet & Athletics Championship 2026',
    category: 'Events',
    content: 'Students selected for track, relay, cricket, and badminton events should report to the sports ground by 8:00 AM in proper house tracksuits.',
    isUrgent: false,
    displayOrder: 3,
    isActive: true,
    publishedAt: new Date(),
  },
];

const initialHeroSlides = [
  {
    _id: '660000000000000000000701',
    title: 'L.K.S.K Convent School',
    subtitle: 'Nurturing scholarly excellence, moral fortitude, and visionary leadership in Panditpur, Sohawal, Ayodhya.',
    imageUrl: '/assets/hero/slide-campus.jpg',
    ctaText: 'Admission Inquiry',
    ctaLink: '/academic/admission-inquiry/',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000702',
    title: 'Smart Digital Classrooms',
    subtitle: 'Engaging interactive boards and individual academic mentoring empowering students to conceptualize deeper.',
    imageUrl: '/assets/hero/slide-classroom.jpg',
    ctaText: 'Explore Classrooms',
    ctaLink: '/campus/classrooms/',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: '660000000000000000000703',
    title: 'Central Library & Resource Hub',
    subtitle: 'An inspiring sanctuary featuring 5,000+ volumes, scholarly journals, reference manuals, and peaceful reading carrels.',
    imageUrl: '/assets/hero/slide-library.jpg',
    ctaText: 'Explore Library',
    ctaLink: '/campus/library/',
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: '660000000000000000000704',
    title: 'Advanced Science & Computer Labs',
    subtitle: 'State-of-the-art physics, chemistry, biology, and high-speed computer laboratories promoting empirical discovery.',
    imageUrl: '/assets/hero/slide-science-lab.jpg',
    ctaText: 'Explore Laboratories',
    ctaLink: '/campus/science-lab/',
    displayOrder: 4,
    isActive: true,
  },
  {
    _id: '660000000000000000000705',
    title: 'Athletic Fields & Co-Curriculars',
    subtitle: 'Sprawling outdoor sports arena, specialized pitch, indoor games hall, and multifaceted holistic development.',
    imageUrl: '/assets/hero/slide-sports.jpg',
    ctaText: 'Campus Facilities',
    ctaLink: '/campus/playground/',
    displayOrder: 5,
    isActive: true,
  },
];

const initialAnnouncements = [
  {
    _id: '660000000000000000000801',
    title: 'Admissions Open for Session 2026–27 (Nursery to Class 12)',
    content: 'Registration forms for admission to academic session 2026–27 are now available online and at the administrative counter.',
    type: 'urgent',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: '660000000000000000000802',
    title: 'Congratulations to District Board Toppers 2025–26!',
    content: 'L.K.S.K Convent School proudly congratulates Ananya Kumar (98.6%) and Saurabh Mishra (97.4%) for District Ranks 1 and 2.',
    type: 'academic',
    displayOrder: 2,
    isActive: true,
  },
];

const initialAdmissions = [
  {
    _id: '660000000000000000000901',
    parentName: 'Ramesh Chandra Verma',
    studentName: 'Aarav Verma',
    applyingClass: 'Class 6',
    phone: '9876543210',
    email: 'ramesh.verma@example.com',
    address: 'Sohawal, Ayodhya',
    status: 'new',
    message: 'Seeking admission for academic session 2026–27 with school bus facility.',
    createdAt: new Date(),
  },
  {
    _id: '660000000000000000000902',
    parentName: 'Sunita Devi',
    studentName: 'Anushka Singh',
    applyingClass: 'Class 1',
    phone: '9876501234',
    email: 'sunita.singh@example.com',
    address: 'Panditpur, Ayodhya',
    status: 'contacted',
    message: 'Inquiring about primary wing syllabus and school timings.',
    createdAt: new Date(Date.now() - 86400000),
  },
];

const initialContacts = [
  {
    _id: '660000000000000000001001',
    name: 'Mahesh Kumar',
    phone: '9812345678',
    email: 'mahesh.k@example.com',
    subject: 'Bus Route & Transport',
    message: 'Does the school bus route cover the Raunahi bypass intersection?',
    isRead: false,
    createdAt: new Date(),
  },
];

class DevMemoryStore {
  constructor() {
    this.data = {
      heroSlides: [...initialHeroSlides],
      announcements: [...initialAnnouncements],
      staff: [...initialStaff],
      galleryAlbums: [...initialAlbums],
      galleryImages: [...initialGalleryImages],
      toppers: [...initialToppers],
      achievements: [...initialAchievements],
      notices: [...initialNotices],
      admissions: [...initialAdmissions],
      contacts: [...initialContacts],
      testimonials: [
        {
          _id: '660000000000000000001101',
          name: 'Shri Alok Pandey',
          role: 'Parent of Class X Student',
          quote: 'The academic rigor, moral atmosphere, and personal attention provided to each student at L.K.S.K Convent School is unmatched in Ayodhya.',
          rating: 5,
          isActive: true,
          displayOrder: 1,
        },
      ],
      documents: [
        {
          _id: '660000000000000000001201',
          title: 'CBSE / State Curriculum Affiliation Certificate',
          category: 'Affiliation',
          fileUrl: '/assets/branding/new%20logo%20transparent.png',
          isActive: true,
        },
      ],
      campusPages: [
        {
          _id: '660000000000000000001301',
          title: 'Classrooms & Learning Studios',
          slug: 'classrooms',
          summary: 'Modern interactive classrooms with optimal natural illumination and multimedia facilities.',
          isActive: true,
        },
        {
          _id: '660000000000000000001302',
          title: 'Advanced Science Laboratory',
          slug: 'science-lab',
          summary: 'Dedicated experimental workstations for Physics, Chemistry, and Biology research.',
          isActive: true,
        },
        {
          _id: '660000000000000000001303',
          title: 'Central Library & Knowledge Hub',
          slug: 'library',
          summary: 'Over 5,000 curricular reference works, encyclopedias, and tranquil reading pods.',
          isActive: true,
        },
      ],
      facilities: [
        {
          _id: '660000000000000000001401',
          name: 'High-Tech Computer & AI Lab',
          category: 'Digital Infrastructure',
          description: 'Modern desktop computers with high-speed internet and coding curriculum.',
          displayOrder: 1,
          isActive: true,
        },
        {
          _id: '660000000000000000001402',
          name: 'Clean RO Water Filtration',
          category: 'Health & Hygiene',
          description: 'Multi-stage RO purification plants supplying clean drinking water campus-wide.',
          displayOrder: 2,
          isActive: true,
        },
        {
          _id: '660000000000000000001403',
          name: 'Dedicated School Bus Network',
          category: 'Safety & Transport',
          description: 'Safe GPS-tracked buses covering Sohawal, Raunahi, and surrounding Ayodhya villages.',
          displayOrder: 3,
          isActive: true,
        },
      ],
      academicContent: [
        {
          _id: '660000000000000000001501',
          gradeLevel: 'Primary Wing (Classes 1–5)',
          stream: 'General Foundational',
          academicYear: '2026–2027',
          curriculumOverview: 'Foundational literacy, arithmetic, environmental studies, and creative expression.',
          displayOrder: 1,
          isActive: true,
        },
        {
          _id: '660000000000000000001502',
          gradeLevel: 'Junior High Wing (Classes 6–8)',
          stream: 'Middle School STEM & Humanities',
          academicYear: '2026–2027',
          curriculumOverview: 'Science, Mathematics, Social Studies, English, Hindi, and Computer Education.',
          displayOrder: 2,
          isActive: true,
        },
      ],
      legalPages: [
        {
          _id: '660000000000000000001601',
          title: 'Privacy Policy',
          slug: 'privacy-policy',
          content: 'L.K.S.K Convent School is committed to safeguarding student and visitor privacy.',
          lastUpdated: new Date(),
          isActive: true,
        },
      ],
    };

    // Aliases
    Object.defineProperty(this.data, 'albums', {
      get: () => this.data.galleryAlbums,
      set: (val) => { this.data.galleryAlbums = val; },
    });
    Object.defineProperty(this.data, 'admissionInquiries', {
      get: () => this.data.admissions,
      set: (val) => { this.data.admissions = val; },
    });
    Object.defineProperty(this.data, 'contactInquiries', {
      get: () => this.data.contacts,
      set: (val) => { this.data.contacts = val; },
    });
  }

  get(collection) {
    let key = collection;
    if (key === 'albums' || key === 'gallery' || key === 'GalleryAlbum') key = 'galleryAlbums';
    if (key === 'admissionInquiries' || key === 'AdmissionInquiry') key = 'admissions';
    if (key === 'contactInquiries' || key === 'ContactInquiry') key = 'contacts';
    if (!this.data[key]) this.data[key] = [];
    return this.data[key];
  }

  matchesFilter(item, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const [key, val] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchesAny = val.some((subFilter) => this.matchesFilter(item, subFilter));
        if (!matchesAny) return false;
        continue;
      }
      if (val instanceof RegExp) {
        if (!val.test(String(item[key] || ''))) return false;
      } else if (val !== undefined && val !== null) {
        if (typeof val === 'object' && !Array.isArray(val)) {
          if (val.$gte !== undefined && !(new Date(item[key]) >= new Date(val.$gte))) return false;
          if (val.$lte !== undefined && !(new Date(item[key]) <= new Date(val.$lte))) return false;
        } else if (typeof val === 'boolean') {
          if (Boolean(item[key]) !== val) return false;
        } else if (String(item[key]).toLowerCase() !== String(val).toLowerCase()) {
          return false;
        }
      }
    }
    return true;
  }

  find(collection, filter = null) {
    const list = this.get(collection);
    if (!filter || (typeof filter === 'object' && Object.keys(filter).length === 0)) {
      return [...list];
    }
    if (typeof filter === 'function') {
      return list.filter(filter);
    }
    return list.filter((item) => this.matchesFilter(item, filter));
  }

  findById(collection, id) {
    return this.get(collection).find((item) => String(item._id) === String(id)) || null;
  }

  create(collection, payload) {
    const list = this.get(collection);
    const item = {
      _id: generateId(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    list.push(item);
    return item;
  }

  findByIdAndUpdate(collection, id, payload) {
    const list = this.get(collection);
    const index = list.findIndex((item) => String(item._id) === String(id));
    if (index === -1) return null;
    list[index] = {
      ...list[index],
      ...payload,
      updatedAt: new Date(),
    };
    return list[index];
  }

  findByIdAndDelete(collection, id) {
    const list = this.get(collection);
    const index = list.findIndex((item) => String(item._id) === String(id));
    if (index === -1) return null;
    const [deleted] = list.splice(index, 1);
    return deleted;
  }

  getStats() {
    return {
      counts: {
        admissionInquiries: this.data.admissions.length,
        pendingAdmissions: this.data.admissions.filter((a) => a.status === 'new').length,
        contactInquiries: this.data.contacts.length,
        unreadContacts: this.data.contacts.filter((c) => !c.isRead).length,
        staff: this.data.staff.length,
        galleryImages: this.data.galleryImages.length,
        testimonials: this.data.testimonials.length,
        achievements: this.data.achievements.length,
        notices: this.data.notices.length,
        documents: this.data.documents.length,
      },
      recentAdmissions: this.data.admissions.slice(0, 5),
      recentContacts: this.data.contacts.slice(0, 5),
      recentNotices: this.data.notices.slice(0, 5),
      databaseStatus: 'development-in-memory',
    };
  }
}

const memoryStore = new DevMemoryStore();
module.exports = { memoryStore };
