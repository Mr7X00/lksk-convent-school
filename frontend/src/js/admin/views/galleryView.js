/**
 * Gallery & Album CMS Management View
 * Features:
 * - Album Management: Create, Rename/Edit, Delete, Enable/Disable, Display Order
 * - Photo Management: Add image to album, Edit/Replace image, Edit caption, Delete image, Enable/Disable, Reorder
 * - Category filter (Campus Life, Sports, Annual Functions, Academic & Science, Celebrations, Infrastructure)
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml, sanitizeUrl } from '../../utils/sanitize.js';

export async function renderGallery(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div id="gallery-breadcrumbs" class="text-xs text-slate-500 font-medium mb-1">
            <span>Gallery CMS</span>
          </div>
          <h2 id="gallery-view-title" class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Photo Gallery &amp; Albums</h2>
          <p id="gallery-view-subtitle" class="text-xs sm:text-sm text-slate-500">Manage photographic albums, event categories, and media assets</p>
        </div>
        <div class="flex items-center gap-2.5">
          <button id="add-album-btn" class="inline-flex items-center px-4 py-2 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Create New Album
          </button>
        </div>
      </div>

      <!-- Main Album / Photos Container -->
      <div id="gallery-content-area" class="space-y-6">
        <!-- Controls Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-3">
            <label class="font-semibold text-slate-600">Category Filter:</label>
            <select id="album-category-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none">
              <option value="">All Categories</option>
              <option value="Campus Life">Campus Life</option>
              <option value="Sports">Sports</option>
              <option value="Annual Functions">Annual Functions</option>
              <option value="Academic &amp; Science">Academic &amp; Science</option>
              <option value="Celebrations">Celebrations</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          <div class="text-slate-400 font-medium" id="albums-count-label">Loading albums...</div>
        </div>

        <!-- Albums Grid -->
        <div id="albums-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div class="col-span-full py-12 text-center text-slate-400">Loading albums...</div>
        </div>
      </div>
    </div>
  `;

  let currentAlbums = [];
  let activeAlbum = null;

  async function loadAlbums() {
    activeAlbum = null;
    const grid = container.querySelector('#albums-grid-container');
    const category = container.querySelector('#album-category-filter').value;
    const countLabel = container.querySelector('#albums-count-label');

    try {
      const res = await AdminAuth.authFetch('/api/gallery?all=true');
      const json = await res.json();
      currentAlbums = json.data || [];

      let filtered = currentAlbums;
      if (category) {
        filtered = filtered.filter(a => (a.category || 'Campus Life').toLowerCase() === category.toLowerCase());
      }

      countLabel.textContent = `${filtered.length} Album${filtered.length === 1 ? '' : 's'}`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center">
            <div class="max-w-xs mx-auto text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <p class="font-semibold text-slate-700 text-sm">No albums found</p>
              <p class="text-xs text-slate-400 mt-1">Create an album to start uploading photographs.</p>
            </div>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(a => {
        const coverImg = sanitizeUrl(a.coverImageUrl || '/assets/branding/new%20logo%20transparent.png');
        const title = escapeHtml(a.title || 'Untitled Album');
        const desc = escapeHtml(a.description || 'No description provided.');
        const cat = escapeHtml(a.category || 'Campus Life');
        const slug = escapeHtml(a.slug || '');
        const order = escapeHtml(String(a.displayOrder || 0));

        return `
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div class="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer open-album-btn" data-id="${a._id}">
            <img src="${coverImg}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='/assets/branding/new%20logo%20transparent.png'" />
            <span class="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${a.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
              ${a.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
            <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-school-navy/80 text-white">
              ${cat}
            </span>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-slate-900 text-sm hover:text-school-blue cursor-pointer open-album-btn" data-id="${a._id}">${title}</h3>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">${desc}</p>
              <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>Slug: <code class="bg-slate-100 px-1 py-0.5 rounded">${slug}</code></span>
                <span>Order: <strong>${order}</strong></span>
              </div>
            </div>

            <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button class="open-album-btn text-school-blue hover:text-blue-700 font-semibold inline-flex items-center" data-id="${a._id}">
                Manage Photos &rarr;
              </button>
              <div class="flex items-center space-x-1">
                <button class="edit-album-btn p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800" title="Edit Album" data-id="${a._id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button class="delete-album-btn p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600" title="Delete Album" data-id="${a._id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      }).join('');

      // Bind Album Events
      grid.querySelectorAll('.open-album-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const album = currentAlbums.find(a => a._id === id);
          if (album) openAlbumPhotos(album);
        });
      });

      grid.querySelectorAll('.edit-album-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const album = currentAlbums.find(a => a._id === id);
          if (album) promptEditAlbum(album);
        });
      });

      grid.querySelectorAll('.delete-album-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const album = currentAlbums.find(a => a._id === id);
          if (album) promptDeleteAlbum(album);
        });
      });

    } catch (err) {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-red-500 text-xs">Error loading albums: ${err.message}</div>`;
    }
  }

  // Manage individual album's photos
  async function openAlbumPhotos(album) {
    activeAlbum = album;
    const breadcrumbs = container.querySelector('#gallery-breadcrumbs');
    const titleEl = container.querySelector('#gallery-view-title');
    const subtitleEl = container.querySelector('#gallery-view-subtitle');
    const contentArea = container.querySelector('#gallery-content-area');

    breadcrumbs.innerHTML = `
      <a href="javascript:void(0)" id="back-to-albums-crumb" class="text-school-blue hover:underline">Gallery CMS</a>
      <span class="mx-1 text-slate-300">/</span>
      <span class="text-slate-700 font-semibold">${album.title}</span>
    `;

    titleEl.textContent = `Album: ${album.title}`;
    subtitleEl.textContent = `Manage, replace, reorder, and add photos for "${album.title}" (${album.category || 'Campus Life'})`;

    contentArea.innerHTML = `
      <!-- Photos Action Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3">
          <button id="back-to-albums-btn" class="inline-flex items-center px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
            &larr; Back to Albums
          </button>
          <span class="text-slate-300">|</span>
          <span class="font-semibold text-slate-600">Category: <span class="text-school-navy font-bold">${album.category || 'Campus Life'}</span></span>
        </div>
        <div class="flex items-center gap-3">
          <button id="add-photo-btn" class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Photo to Album
          </button>
        </div>
      </div>

      <!-- Photos Grid -->
      <div id="photos-grid-container" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div class="col-span-full py-12 text-center text-slate-400">Loading photographs...</div>
      </div>
    `;

    container.querySelector('#back-to-albums-crumb')?.addEventListener('click', resetToAlbums);
    container.querySelector('#back-to-albums-btn')?.addEventListener('click', resetToAlbums);
    container.querySelector('#add-photo-btn')?.addEventListener('click', () => promptAddPhoto(album));

    await loadPhotos(album);
  }

  async function loadPhotos(album) {
    const photosGrid = container.querySelector('#photos-grid-container');
    try {
      const res = await AdminAuth.authFetch(`/api/gallery/id/${album._id}?all=true`);
      const json = await res.json();
      const photos = json.data?.images || [];

      if (photos.length === 0) {
        photosGrid.innerHTML = `
          <div class="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p class="font-semibold text-slate-700 text-sm">No photos in this album</p>
            <p class="text-xs text-slate-400 mt-1">Click "Add Photo to Album" above to upload or link photographs.</p>
          </div>
        `;
        return;
      }

      photosGrid.innerHTML = photos.map(p => {
        const img = sanitizeUrl(p.imageUrl || '/assets/branding/new%20logo%20transparent.png');
        const title = escapeHtml(p.title || 'Untitled Photo');
        const caption = escapeHtml(p.caption || 'No caption');
        const order = escapeHtml(String(p.displayOrder || 0));

        return `
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
          <div class="relative aspect-square bg-slate-100 overflow-hidden">
            <img src="${img}" alt="${caption || title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" onerror="this.src='/assets/branding/new%20logo%20transparent.png'" />
            <span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
              ${p.isActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div class="p-2.5 flex-1 flex flex-col justify-between text-xs">
            <div>
              <p class="font-semibold text-slate-800 line-clamp-1">${title}</p>
              <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${caption}</p>
              <p class="text-[10px] text-slate-400 mt-1">Order: <strong>${order}</strong></p>
            </div>

            <div class="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
              <button class="edit-photo-btn text-[11px] text-school-blue hover:text-blue-700 font-semibold" data-id="${p._id}">
                Edit / Replace
              </button>
              <button class="delete-photo-btn p-1 text-slate-400 hover:text-red-600 rounded" title="Delete Photo" data-id="${p._id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
      }).join('');

      photosGrid.querySelectorAll('.edit-photo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const photo = photos.find(p => p._id === id);
          if (photo) promptEditPhoto(photo, album);
        });
      });

      photosGrid.querySelectorAll('.delete-photo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const photo = photos.find(p => p._id === id);
          if (photo) promptDeletePhoto(photo, album);
        });
      });

    } catch (err) {
      photosGrid.innerHTML = `<div class="col-span-full py-8 text-center text-red-500 text-xs">Error loading photos: ${err.message}</div>`;
    }
  }

  function resetToAlbums() {
    renderGallery(container);
  }

  // Album Dialogs
  function promptCreateAlbum() {
    showFormModal({
      title: 'Create New Photo Album',
      fields: [
        { name: 'title', label: 'Album Title', required: true, placeholder: 'e.g. Annual Sports Meet 2026' },
        { name: 'slug', label: 'URL Slug', required: true, placeholder: 'e.g. annual-sports-meet-2026' },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'Campus Life', label: 'Campus Life' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Annual Functions', label: 'Annual Functions' },
            { value: 'Academic & Science', label: 'Academic & Science' },
            { value: 'Celebrations', label: 'Celebrations' },
            { value: 'Infrastructure', label: 'Infrastructure' },
          ],
          defaultValue: 'Campus Life',
        },
        { name: 'coverImageUrl', label: 'Cover Image URL', required: true, placeholder: 'https://images.unsplash.com/...' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Summary of the event or occasion' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active (Visible on public gallery)', type: 'checkbox', defaultValue: true },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch('/api/gallery', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Album created successfully', 'success');
            loadAlbums();
          } else {
            showToast(json.message || 'Failed to create album', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptEditAlbum(album) {
    showFormModal({
      title: 'Edit / Rename Album',
      fields: [
        { name: 'title', label: 'Album Title', required: true, defaultValue: album.title },
        { name: 'slug', label: 'URL Slug', required: true, defaultValue: album.slug },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'Campus Life', label: 'Campus Life' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Annual Functions', label: 'Annual Functions' },
            { value: 'Academic & Science', label: 'Academic & Science' },
            { value: 'Celebrations', label: 'Celebrations' },
            { value: 'Infrastructure', label: 'Infrastructure' },
          ],
          defaultValue: album.category || 'Campus Life',
        },
        { name: 'coverImageUrl', label: 'Cover Image URL', required: true, defaultValue: album.coverImageUrl },
        { name: 'description', label: 'Description', type: 'textarea', defaultValue: album.description || '' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: album.displayOrder || 0 },
        { name: 'isActive', label: 'Active Album', type: 'checkbox', defaultValue: album.isActive },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch(`/api/gallery/${album._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Album updated successfully', 'success');
            loadAlbums();
          } else {
            showToast(json.message || 'Failed to update album', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptDeleteAlbum(album) {
    showConfirmModal({
      title: 'Delete Photo Album?',
      message: `Are you sure you want to delete "${album.title}"? All photographs inside this album will also be permanently deleted.`,
      confirmText: 'Delete Album',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const res = await AdminAuth.authFetch(`/api/gallery/${album._id}`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (json.success) {
            showToast('Album deleted successfully', 'success');
            loadAlbums();
          } else {
            showToast(json.message || 'Failed to delete album', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  // Photo Dialogs
  function promptAddPhoto(album) {
    showFormModal({
      title: `Add Photo to "${album.title}"`,
      fields: [
        { name: 'imageUrl', label: 'Image URL', required: true, placeholder: 'https://images.unsplash.com/...' },
        { name: 'title', label: 'Photo Title (Optional)', placeholder: 'e.g. Prize Distribution Ceremony' },
        { name: 'caption', label: 'Caption / Subtext', type: 'textarea', placeholder: 'Brief explanation for lightbox preview' },
        { name: 'displayOrder', label: 'Display Order (Ascending)', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active (Visible)', type: 'checkbox', defaultValue: true },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch(`/api/gallery/${album._id}/images`, {
            method: 'POST',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Photo added to album', 'success');
            loadPhotos(album);
          } else {
            showToast(json.message || 'Failed to add photo', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptEditPhoto(photo, album) {
    showFormModal({
      title: 'Edit / Replace Photograph',
      fields: [
        { name: 'imageUrl', label: 'Image URL (Replace here)', required: true, defaultValue: photo.imageUrl },
        { name: 'title', label: 'Photo Title', defaultValue: photo.title || '' },
        { name: 'caption', label: 'Caption', type: 'textarea', defaultValue: photo.caption || '' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: photo.displayOrder || 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: photo.isActive },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch(`/api/gallery/images/${photo._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Photo updated successfully', 'success');
            loadPhotos(album);
          } else {
            showToast(json.message || 'Failed to update photo', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptDeletePhoto(photo, album) {
    showConfirmModal({
      title: 'Delete Photo?',
      message: 'Are you sure you want to permanently delete this photograph from the album?',
      confirmText: 'Delete Photo',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const res = await AdminAuth.authFetch(`/api/gallery/images/${photo._id}`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (json.success) {
            showToast('Photo removed from album', 'success');
            loadPhotos(album);
          } else {
            showToast(json.message || 'Failed to delete photo', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  // Initial bindings
  container.querySelector('#add-album-btn')?.addEventListener('click', promptCreateAlbum);
  container.querySelector('#album-category-filter')?.addEventListener('change', loadAlbums);

  loadAlbums();
}
