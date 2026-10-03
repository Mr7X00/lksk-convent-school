/**
 * Campus Infrastructure Pages Controller
 * Manages all 11 campus subpages: Classrooms, Principal's Room, Conference Room,
 * Parking Space, Playground, Water Facility, Assembly Area, School Library,
 * Computer Lab, Science Lab, and Transport.
 *
 * Supports Title, Description, Image Gallery with Lightbox, Carousel,
 * Optional Video, and Key Highlights.
 * Connects with /api/campus and /api/facilities.
 * L.K.S.K Convent School
 */

import { UIStates } from '../components/uiStates.js';
import { AccessibleCarousel } from '../components/carousel.js';
import { Lightbox } from '../components/lightbox.js';

export const CampusController = {
  /**
   * Initializes a specific campus facility page by slug
   * @param {string} slug 
   */
  async initCampusPage(slug) {
    const titleEl = document.getElementById('campus-page-title');
    const descEl = document.getElementById('campus-page-desc');
    const highlightsContainer = document.getElementById('campus-highlights-container');
    const carouselTrack = document.getElementById('campus-carousel-track');
    const galleryContainer = document.getElementById('campus-gallery-container');
    const videoSection = document.getElementById('campus-video-section');

    const facilityData = this.getFacilityDefaults(slug);

    if (!facilityData) return;

    // Apply Content to DOM
    if (titleEl) titleEl.textContent = facilityData.title;
    if (descEl) descEl.innerHTML = facilityData.description;

    // Render Highlights
    if (highlightsContainer && Array.isArray(facilityData.highlights)) {
      highlightsContainer.innerHTML = facilityData.highlights.map((h) => `
        <li class="flex items-start space-x-3 p-3.5 rounded bg-school-surface-parchment border border-school-slate-200">
          <svg class="w-5 h-5 text-school-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-xs sm:text-sm text-school-slate-700 font-medium leading-relaxed">${h}</span>
        </li>
      `).join('');
    }

    // Render Carousel Slides
    if (carouselTrack && Array.isArray(facilityData.carouselImages)) {
      carouselTrack.innerHTML = facilityData.carouselImages.map((img, idx) => `
        <div class="carousel-slide min-w-full relative flex items-center justify-center aspect-[16/9] bg-school-navy-950 overflow-hidden">
          <img src="${img.src}" alt="${img.caption}" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-school-navy-950/80 to-transparent p-4 sm:p-6 text-white text-xs sm:text-sm font-medium">
            ${img.caption}
          </div>
        </div>
      `).join('');

      const carouselEl = document.querySelector('[data-carousel]');
      if (carouselEl) {
        new AccessibleCarousel(carouselEl);
      }
    }

    // Render Image Gallery
    if (galleryContainer && Array.isArray(facilityData.galleryImages)) {
      galleryContainer.innerHTML = facilityData.galleryImages.map((img) => `
        <button type="button" data-lightbox-src="${img.src}" data-lightbox-caption="${facilityData.title} - ${img.caption}" class="group relative rounded-academic overflow-hidden border border-school-slate-200 aspect-[4/3] focus:outline-none">
          <img src="${img.src}" alt="${img.caption}" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute inset-0 bg-school-navy-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white text-center">
            <span class="text-xs font-semibold">${img.caption}</span>
          </div>
        </button>
      `).join('');

      new Lightbox();
    }

    // Optional Video Setup
    if (videoSection && facilityData.videoUrl) {
      videoSection.classList.remove('hidden');
      const video = videoSection.querySelector('video');
      if (video) {
        video.src = facilityData.videoUrl;
        if (facilityData.videoPoster) video.poster = facilityData.videoPoster;
      }
    }

    // Try fetching any live overrides from REST API /api/campus or /api/facilities
    try {
      const res = await fetch(`/api/campus?all=false`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const matched = json.data.find(p => p.slug === slug);
          if (matched && matched.content) {
            if (descEl) descEl.innerHTML = `<p>${matched.content}</p>`;
            if (matched.title && titleEl) titleEl.textContent = matched.title;
          }
        }
      }
    } catch {
      // Retain clean default institutional presentation
    }
  },

  getFacilityDefaults(slug) {
    const facilities = {
      'classrooms': {
        title: 'Modern Ventilated Classrooms',
        description: 'Spacious, well-illuminated and scientifically ventilated learning spaces with ergonomic furniture, digital projection capabilities, and interactive pedagogical display boards.',
        highlights: [
          'Ergonomic student desks designed for healthy posture during extended study',
          'Optimum cross-ventilation and natural daylight minimizing eye strain',
          'Interactive smart boards for conceptual visual learning',
          'Teacher display boards showcasing student charts and academic work',
          'CCTV monitored rooms ensuring safety and disciplined focus'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Interactive Learning in Smart Classrooms' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Spacious Classrooms in Main Academic Wing' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Classroom Lecture View' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Academic Building View' },
        ],
        videoUrl: '',
        videoPoster: '/assets/hero/slide-classroom.jpg',
      },
      'principal-room': {
        title: "Principal's Office & Executive Desk",
        description: "A dignified administrative chamber designated for scholastic leadership, academic planning, parent consultations, and executive school governance.",
        highlights: [
          'Dedicated consultation area for parent-teacher academic reviews',
          'Central CCTV telemetry console monitoring overall campus safety',
          'Curricular archive containing student cumulative records',
          'Meeting space for senior faculty department heads and academic boards'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: "Executive Administrative Wing" },
          { src: '/assets/hero/slide-library.jpg', caption: 'Academic Guidance & Archival Desk' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Administrative Wing Entrance' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Academic Coordination Area' },
        ]
      },
      'conference-room': {
        title: 'Institutional Conference Room',
        description: 'Modern conference facility tailored for institutional meetings, teacher professional development workshops, and community education seminars.',
        highlights: [
          'High-definition projection and presentation screen',
          'Acoustically balanced meeting space accommodating 30+ attendees',
          'Teleconference and digital faculty seminar capabilities',
          'Formal roundtable setup for academic advisory councils'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-library.jpg', caption: 'Conference & Seminar Hall' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Main Wing Faculty Chambers' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-library.jpg', caption: 'Seminar Setup' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Audio-Visual Presentation Area' },
        ]
      },
      'parking': {
        title: 'Dedicated Parking Space',
        description: 'Organized vehicular parking facility with separate bays for school buses, vans, staff automobiles, two-wheelers, and visitor vehicles.',
        highlights: [
          'Designated bus transit lanes avoiding pedestrian crossover',
          '24/7 manned security check-post and gate surveillance',
          'Smooth entry and exit access onto Sohawal link road',
          'Covered parking bays for faculty two-wheelers'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Campus Approach & Transport Bays' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Perimeter Boundary & Safe Access' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Front Access Gate' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Vehicle Bay Perimeter' },
        ]
      },
      'playground': {
        title: 'Athletic Sports Fields & Playground',
        description: 'Multi-sport outdoor grounds encouraging physical vigor, athletic discipline, track training, cricket matches, football, and volleyball.',
        highlights: [
          'Leveled turf sports field for team competitions and daily recess',
          'Athletic running track for sprinting and long-distance training',
          'Volleyball and badminton outdoor court installations',
          'Supervised sports periods under qualified Physical Education directors'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-sports.jpg', caption: 'Athletics Meet on School Grounds' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Playground adjacent to Academic Wing' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-sports.jpg', caption: 'Athletic Sprint Track' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Open Field View' },
        ],
        videoUrl: '',
        videoPoster: '/assets/hero/slide-sports.jpg',
      },
      'water-facility': {
        title: 'Pure Drinking Water Facility (Commercial RO)',
        description: 'Multi-stage Commercial Reverse Osmosis (RO) filtration plants and chilled UV-treated drinking water stations installed across all classroom floors.',
        highlights: [
          'Commercial multi-stage RO purification removing chemical impurities',
          'Regular laboratory water quality testing and bacterial screening',
          'Hygienic stainless steel dispensing taps with drainage grates',
          'Uninterrupted water supply with backup reservoirs'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Hygienic Drinking Water Stations' },
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Pure Water Infrastructure' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Purification Unit Location' },
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Clean Testing Station' },
        ]
      },
      'assembly': {
        title: 'Morning Assembly & Cultural Quadrangle',
        description: 'Central open-air assembly quadrangle where the student body convenes each morning for prayer, moral thought recitation, national anthem, and public speaking.',
        highlights: [
          'Spacious open courtyard accommodating entire school student strength',
          'Audio public address (PA) system with wireless microphone stands',
          'Stage platform for daily moral talks, news updates, and pledge',
          'National flag post for Independence Day and Republic Day parades'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Central Assembly Quadrangle' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Parade & Gathering Grounds' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Assembly Quadrangle View' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Morning Gathering Area' },
        ]
      },
      'library': {
        title: 'Central School Library & Reading Room',
        description: 'A rich repository of over 5,000 academic textbooks, reference volumes, dictionaries, literature anthologies, and educational journals.',
        highlights: [
          'Curriculum-aligned reference books across all NCERT/CBSE subjects',
          'Quiet reading tables with individual reading lamps and natural light',
          'Section dedicated to Hindi literature, moral tales, and Indian history',
          'Open-access borrowing policy cultivating lifelong reading habits'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-library.jpg', caption: 'Central Library Reading Hall' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Study Workstations' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-library.jpg', caption: 'Reading Room Stack' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Knowledge Resource Wing' },
        ]
      },
      'computer-lab': {
        title: 'Computer Science & ICT Laboratory',
        description: 'Equipped digital lab with networked desktop computers, high-speed broadband connectivity, programming environments, and computer literacy instruction.',
        highlights: [
          'High-speed fiber-optic internet with educational firewall filtering',
          'Curriculum covering MS Office, scratch coding, Python basics, and typing',
          'Uninterrupted power supply (UPS & generator backup)',
          'One-to-one computer access during scheduled practical periods'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Digital Computing Lab' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Interactive Learning Console' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Computing Workstations' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Coding Screen Setup' },
        ]
      },
      'science-lab': {
        title: 'Composite Science Laboratories',
        description: 'Dedicated practical experimentation facilities for Physics, Chemistry, and Biology equipped with precision apparatus, microscopes, and chemical reagents.',
        highlights: [
          'Full set of optical benches, prisms, lenses, and electrical meters',
          'Chemical reagents and test apparatus under strict laboratory supervision',
          'Compound and dissecting microscopes for biological specimens',
          'Fire safety extinguishers, emergency eyewash, and first-aid kits'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Students Performing Science Practicals' },
          { src: '/assets/hero/slide-classroom.jpg', caption: 'Practical Demonstration Bench' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-science-lab.jpg', caption: 'Microscope & Chemistry Station' },
          { src: '/assets/hero/slide-campus.jpg', caption: 'Science Wing Labs' },
        ],
        videoUrl: '',
        videoPoster: '/assets/hero/slide-science-lab.jpg',
      },
      'transport': {
        title: 'Safe Bus & Van Transport Network',
        description: 'Planned fleet of GPS-equipped school buses and vans navigating safe, timely routes across Sohawal, Raunahi, Deokali, and adjacent Ayodhya rural settlements.',
        highlights: [
          'Live GPS bus telemetry ensuring parents know transit location',
          'Police-verified drivers and dedicated female bus attendants',
          'First-aid boxes and fire safety extinguishers in every bus',
          'Well-charted stops providing doorstep or village-junction pickup'
        ],
        carouselImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'School Bus Fleet & Boarding Area' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Safe Transit Routes' },
        ],
        galleryImages: [
          { src: '/assets/hero/slide-campus.jpg', caption: 'Bus Fleet Boarding' },
          { src: '/assets/hero/slide-sports.jpg', caption: 'Transit Perimeter' },
        ]
      }
    };

    return facilities[slug] || facilities['classrooms'];
  }
};
