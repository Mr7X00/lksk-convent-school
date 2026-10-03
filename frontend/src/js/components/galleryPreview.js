/**
 * Homepage Gallery Preview Component
 * Dynamically fetches active albums from /api/gallery and updates
 * the homepage gallery grid while preserving fallback items if offline.
 */

import { UIStates } from './uiStates.js';

export async function initHomepageGallery() {
  const grid = document.getElementById('homepage-gallery-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/gallery');
    if (!res.ok) return;

    const json = await res.json();
    const albums = (json.data || []).filter((a) => a.isActive !== false);

    // If no backend albums exist, keep the curated homepage cards
    if (albums.length === 0) return;

    const displayAlbums = albums.slice(0, 4);

    grid.innerHTML = displayAlbums
      .map((album) => {
        const title = album.title || 'Campus Event';
        const category = album.category || 'Campus Life';
        const description = album.description || 'Capturing vibrant moments and student achievements at L.K.S.K Convent School.';
        const coverImg =
          album.coverImageUrl ||
          '/assets/hero/slide-campus.jpg';
        const slug = album.slug || '';

        return `
        <article class="academic-card overflow-hidden group flex flex-col justify-between border border-school-slate-200/80 hover:shadow-card-hover transition-all duration-300 bg-white">
          <div 
            data-lightbox-src="${coverImg}" 
            data-lightbox-caption="${title} — ${category}" 
            class="relative aspect-[4/3] bg-school-slate-100 overflow-hidden cursor-pointer"
          >
            <img src="${coverImg}" alt="${title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='/assets/hero/slide-campus.jpg'" />
            <div class="absolute inset-0 bg-gradient-to-t from-school-navy-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-school-navy-950/85 backdrop-blur-md text-school-gold border border-school-gold/40 shadow-sm">
              ${category}
            </span>
            <span class="absolute bottom-3 right-3 p-1.5 rounded-full bg-white/90 text-school-navy group-hover:bg-school-gold group-hover:text-school-navy-950 transition-all shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            </span>
          </div>
          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
            <div>
              <p class="gallery-card-category text-[11px] font-extrabold uppercase tracking-wider text-amber-700 mb-1" style="color: #b45309 !important;">${category}</p>
              <h3 class="text-sm sm:text-base font-bold font-serif text-slate-900 group-hover:text-sky-700 transition-colors leading-snug" style="color: #0c2340 !important;">${title}</h3>
              <p class="gallery-card-desc text-xs text-slate-700 mt-2 leading-relaxed line-clamp-3" style="color: #334155 !important;">${description}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a href="/gallery/?album=${encodeURIComponent(slug)}" class="inline-flex items-center text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-0.5 transition-all" style="color: #0284c7 !important;">
                <span>Explore Album</span>
                <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
              <span class="text-[10px] text-slate-500 font-medium" style="color: #64748b !important;">Campus Event</span>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  } catch (err) {
    console.warn('Homepage gallery dynamic preview failed, using static albums:', err);
  }
}
