/**
 * Public Gallery Controller
 * Handles:
 * - Fetching active albums from GET /api/gallery
 * - Category filtering (Campus Life, Sports, Annual Functions, Academic & Science, Celebrations, Infrastructure)
 * - Album selection & viewing album images (GET /api/gallery/:slug)
 * - Lightbox triggering with image previews and captions
 * - Keyboard & touch support
 * - Skeleton loading & empty states
 */

import { openLightboxWithImages } from '../components/lightbox.js';
import { UIStates } from '../components/uiStates.js';

export const DEFAULT_ALBUMS = [
  {
    title: 'Welcome Republic Day Patriotic Art & Celebrations',
    slug: 'republic-day-celebration',
    category: 'Celebrations',
    description: 'A breathtaking traditional rangoli welcoming guests and students to the 76th Republic Day celebrations at L.K.S.K Convent School, embodying national pride, unity, and festive campus spirit.',
    coverImageUrl: '/assets/gallery/republic-day-rangoli.jpg',
    eventDate: '2026-01-26',
    isActive: true,
    images: [
      {
        imageUrl: '/assets/gallery/republic-day-rangoli.jpg',
        title: 'Welcome Republic Day Celebrations',
        caption: 'Welcome Republic Day Celebrations — Vibrant handmade rangoli artwork welcoming students, faculty, and guests at L.K.S.K Convent School.'
      }
    ]
  },
  {
    title: 'Junior Scholastic Merit Felicitation',
    slug: 'junior-academic-felicitation',
    category: 'Academic & Science',
    description: 'A proud L.K.G student being honored with the official Academic Excellence Certificate alongside their class educator, celebrating foundational brilliance, discipline, and enthusiastic learning.',
    coverImageUrl: '/assets/gallery/lkg-academic-excellence.jpg',
    eventDate: '2026-02-15',
    isActive: true,
    images: [
      {
        imageUrl: '/assets/gallery/lkg-academic-excellence.jpg',
        title: 'L.K.G Academic Excellence Certificate Felicitation',
        caption: 'Proud young scholar receiving the Academic Excellence Certificate alongside teacher at L.K.S.K Convent School.'
      },
      {
        imageUrl: '/assets/gallery/academic-excellence.jpg',
        title: 'Senior Scholastic Merit Felicitation',
        caption: 'Merit certificate presentation recognizing outstanding academic diligence and classroom commitment.'
      }
    ]
  },
  {
    title: 'Little Chefs Culinary Workshop',
    slug: 'culinary-nutrition-workshop',
    category: 'Campus Life',
    description: 'Enthusiastic students demonstrating culinary creativity and healthy nutrition through fireless sandwich crafting and team plating activities, fostering essential life skills and cooperative camaraderie.',
    coverImageUrl: '/assets/gallery/culinary-activity.jpg',
    eventDate: '2026-02-20',
    isActive: true,
    images: [
      {
        imageUrl: '/assets/gallery/culinary-activity.jpg',
        title: 'Little Chefs Practical Nutrition Workshop',
        caption: 'Students happily demonstrating teamwork, food hygiene, and sandwich preparation skills.'
      }
    ]
  },
  {
    title: '"Save Our Earth" Environmental Rangoli',
    slug: 'save-earth-rangoli-art',
    category: 'Campus Life',
    description: 'Students and teachers gathered around a magnificent circular floor artwork illustrating environmental balance, inspiring climate stewardship, tree conservation, and sustainable community living.',
    coverImageUrl: '/assets/gallery/rangoli-competition.jpg',
    eventDate: '2026-03-01',
    isActive: true,
    images: [
      {
        imageUrl: '/assets/gallery/rangoli-competition.jpg',
        title: 'Save Our Earth Collaborative Environmental Art',
        caption: 'Faculty and students gathered around the circular environmental conservation rangoli at L.K.S.K Convent School.'
      }
    ]
  },
  {
    title: 'Maa Saraswati Vandana & Cultural Puja',
    slug: 'cultural-puja-celebration',
    category: 'Celebrations',
    description: 'Faculty members and students participating in sacred invocations to the Goddess of Wisdom, preserving cultural roots, devotion, and character building at L.K.S.K Convent School.',
    coverImageUrl: '/assets/gallery/cultural-puja.jpg',
    eventDate: '2026-02-02',
    isActive: true,
    images: [
      {
        imageUrl: '/assets/gallery/cultural-puja.jpg',
        title: 'Basant Panchami Saraswati Puja Ceremony',
        caption: 'Auspicious celebrations, traditional prayers, and prasad distribution celebrating the divine patroness of learning.'
      }
    ]
  }
];

export const GalleryController = {
  albums: [],
  currentCategory: '',
  selectedAlbum: null,

  async initGalleryPage() {
    const albumsContainer = document.getElementById('gallery-albums-container');
    const photosContainer = document.getElementById('gallery-photos-container');
    const filterButtons = document.querySelectorAll('.gallery-category-btn');
    const backBtn = document.getElementById('gallery-back-to-albums-btn');

    if (!albumsContainer) return;

    // Check if URL has ?album=slug
    const urlParams = new URLSearchParams(window.location.search);
    const albumSlug = urlParams.get('album');

    // Category button clicks
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-school-navy', 'text-white');
          b.classList.add('bg-white', 'text-school-slate-700');
        });
        btn.classList.remove('bg-white', 'text-school-slate-700');
        btn.classList.add('bg-school-navy', 'text-white');

        this.currentCategory = btn.dataset.category || '';
        if (this.selectedAlbum) {
          this.showAlbumsView();
        }
        this.renderAlbums();
      });
    });

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.showAlbumsView();
      });
    }

    try {
      this.renderSkeleton(albumsContainer, 6);
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const json = await res.json();
        this.albums = (json.data || []).filter(a => a.isActive !== false);
      }
      
      // Fallback to rich curated default albums if backend returns empty
      if (!this.albums || this.albums.length === 0) {
        this.albums = DEFAULT_ALBUMS;
      }

      if (albumSlug) {
        const found = this.albums.find(a => a.slug === albumSlug);
        if (found) {
          await this.loadAlbumDetails(found.slug);
          return;
        }
      }

      this.renderAlbums();
    } catch (err) {
      console.warn('Backend gallery fetch failed, using default curated albums:', err);
      this.albums = DEFAULT_ALBUMS;
      if (albumSlug) {
        const found = this.albums.find(a => a.slug === albumSlug);
        if (found) {
          await this.loadAlbumDetails(found.slug);
          return;
        }
      }
      this.renderAlbums();
    }
  },

  renderSkeleton(container, count = 6) {
    container.innerHTML = UIStates.skeletonGallery(count);
  },

  renderEmpty(container, message) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="max-w-md mx-auto space-y-3 text-school-slate-400">
          <svg class="w-12 h-12 mx-auto text-school-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-sm font-semibold text-school-slate-600">${message}</p>
          <p class="text-xs text-school-slate-400">Photographs are updated periodically following academic and cultural events.</p>
        </div>
      </div>
    `;
  },

  renderAlbums() {
    const container = document.getElementById('gallery-albums-container');
    if (!container) return;

    let filtered = this.albums;
    if (this.currentCategory) {
      filtered = filtered.filter(a => (a.category || 'Campus Life').toLowerCase() === this.currentCategory.toLowerCase());
    }

    if (filtered.length === 0) {
      this.renderEmpty(container, 'No albums found in this category.');
      return;
    }

    container.innerHTML = filtered.map(a => `
      <article class="academic-card overflow-hidden group cursor-pointer hover:shadow-modal transition-all duration-300 flex flex-col justify-between" data-slug="${a.slug}">
        <div class="relative aspect-video bg-school-slate-100 overflow-hidden">
          <img
            src="${a.coverImageUrl || '/assets/branding/new%20logo%20transparent.png'}"
            alt="${a.title}"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onerror="this.src='/assets/branding/new%20logo%20transparent.png'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-school-navy-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          <span class="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-school-gold text-white shadow-sm">
            ${a.category || 'Campus Life'}
          </span>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-bold font-serif text-school-navy text-base sm:text-lg group-hover:text-school-blue transition-colors line-clamp-1">
              ${a.title}
            </h3>
            <p class="text-xs text-school-slate-600 mt-1 line-clamp-2 leading-relaxed">
              ${a.description || 'View the complete photographic archive of this event.'}
            </p>
          </div>

          <div class="pt-3 border-t border-school-slate-100 flex items-center justify-between text-xs text-school-slate-500">
            <span>${a.eventDate ? new Date(a.eventDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Event Archive'}</span>
            <span class="font-semibold text-school-blue flex items-center group-hover:translate-x-1 transition-transform">
              <span>View Album</span>
              <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </span>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('article[data-slug]').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        this.loadAlbumDetails(slug);
      });
    });
  },

  async loadAlbumDetails(slug) {
    const albumsView = document.getElementById('gallery-albums-view');
    const photosView = document.getElementById('gallery-photos-view');
    const photosContainer = document.getElementById('gallery-photos-container');
    const albumTitleEl = document.getElementById('gallery-active-album-title');
    const albumCategoryEl = document.getElementById('gallery-active-album-category');
    const albumDescEl = document.getElementById('gallery-active-album-desc');

    if (!photosView) return;

    albumsView.classList.add('hidden');
    photosView.classList.remove('hidden');
    window.scrollTo({ top: photosView.offsetTop - 80, behavior: 'smooth' });

    this.renderSkeleton(photosContainer, 8);

    try {
      let album = null;
      let images = [];

      try {
        const res = await fetch(`/api/gallery/${slug}`);
        if (res.ok) {
          const json = await res.json();
          album = json.data?.album;
          images = json.data?.images || [];
        }
      } catch (fetchErr) {
        console.warn('Backend album detail fetch failed, checking default albums:', fetchErr);
      }

      if (!album || images.length === 0) {
        const defaultMatch = DEFAULT_ALBUMS.find(a => a.slug === slug);
        if (defaultMatch) {
          album = defaultMatch;
          images = defaultMatch.images || [];
        }
      }

      this.selectedAlbum = album;

      if (albumTitleEl) albumTitleEl.textContent = album?.title || 'Photo Album';
      if (albumCategoryEl) albumCategoryEl.textContent = album?.category || 'Campus Life';
      if (albumDescEl) albumDescEl.textContent = album?.description || '';

      // Update URL without reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('album', slug);
      window.history.pushState({}, '', newUrl);

      if (!images || images.length === 0) {
        this.renderEmpty(photosContainer, 'No photographs uploaded to this album yet.');
        return;
      }

      photosContainer.innerHTML = images.map((img, idx) => `
        <figure class="academic-card overflow-hidden group cursor-pointer relative" data-index="${idx}">
          <div class="relative aspect-square sm:aspect-[4/3] bg-school-slate-100 overflow-hidden">
            <img
              src="${img.imageUrl}"
              alt="${img.caption || img.title || (album?.title ? `${album.title} — L.K.S.K Convent School` : 'L.K.S.K Convent School Campus Photograph')}"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onerror="this.src='/assets/branding/new%20logo%20transparent.png'"
            />
            <div class="absolute inset-0 bg-school-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </span>
            </div>
          </div>
          ${img.caption ? `
            <figcaption class="p-3 bg-white border-t border-school-slate-100 text-[11px] text-school-slate-600 line-clamp-1">
              ${img.caption}
            </figcaption>
          ` : ''}
        </figure>
      `).join('');

      // Prepare images list for lightbox
      const lightboxList = images.map(img => ({
        src: img.imageUrl,
        caption: img.caption || img.title || album?.title || 'School Photograph',
      }));

      photosContainer.querySelectorAll('figure[data-index]').forEach(fig => {
        fig.addEventListener('click', () => {
          const idx = parseInt(fig.dataset.index, 10);
          openLightboxWithImages(lightboxList, idx);
        });
      });

    } catch (err) {
      console.error('Failed to load album images:', err);
      this.renderEmpty(photosContainer, 'Failed to load photographs for this album.');
    }
  },

  showAlbumsView() {
    this.selectedAlbum = null;
    const albumsView = document.getElementById('gallery-albums-view');
    const photosView = document.getElementById('gallery-photos-view');
    if (albumsView && photosView) {
      photosView.classList.add('hidden');
      albumsView.classList.remove('hidden');

      // Clear ?album from URL
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('album');
      window.history.pushState({}, '', newUrl);
    }
  },
};
