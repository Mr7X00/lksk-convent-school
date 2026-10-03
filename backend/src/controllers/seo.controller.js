/**
 * SEO Controller
 * Dynamic Sitemap and Robots.txt generation
 * L.K.S.K Convent School
 */

const { Notice, GalleryAlbum } = require('../models');
const { isDatabaseConnected } = require('../config/db');

// List of verified static public indexable routes
const STATIC_PUBLIC_ROUTES = [
  '/',
  '/about/',
  '/about/manager/',
  '/about/principal/',
  '/about/mission-vision/',
  '/about/faculty/',
  '/academic/admission-process/',
  '/academic/admission-inquiry/',
  '/academic/toppers/',
  '/academic/achievements/',
  '/academic/co-curricular/',
  '/academic/calendar/',
  '/academic/syllabus/',
  '/academic/timetable/',
  '/academic/notices/',
  '/academic/holidays/',
  '/campus/classrooms/',
  '/campus/playground/',
  '/campus/library/',
  '/campus/computer-lab/',
  '/campus/science-lab/',
  '/campus/transport/',
  '/campus/water-facility/',
  '/campus/assembly/',
  '/campus/principal-room/',
  '/campus/conference-room/',
  '/campus/parking/',
  '/gallery/',
  '/contact/',
  '/legal/',
];

/**
 * Get configured public site URL without trailing slash
 */
function getBaseSiteUrl(req) {
  if (process.env.PUBLIC_SITE_URL) {
    return process.env.PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * GET /sitemap.xml
 */
async function getSitemap(req, res) {
  const siteUrl = getBaseSiteUrl(req);
  const today = new Date().toISOString().split('T')[0];

  let dynamicNoticeUrls = [];
  let dynamicAlbumUrls = [];

  if (isDatabaseConnected()) {
    try {
      const [notices, albums] = await Promise.all([
        Notice.find({ isActive: true })
          .select('_id updatedAt publishDate')
          .sort({ publishDate: -1 })
          .limit(100),
        GalleryAlbum.find({ isActive: true })
          .select('slug updatedAt createdAt')
          .sort({ createdAt: -1 })
          .limit(50),
      ]);

      dynamicNoticeUrls = notices.map((n) => {
        const lastmodDate = n.updatedAt || n.publishDate || new Date();
        const lastmod = new Date(lastmodDate).toISOString().split('T')[0];
        return `  <url>\n    <loc>${escapeXml(`${siteUrl}/academic/notices/?id=${n._id}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
      });

      dynamicAlbumUrls = albums.map((a) => {
        const lastmodDate = a.updatedAt || a.createdAt || new Date();
        const lastmod = new Date(lastmodDate).toISOString().split('T')[0];
        return `  <url>\n    <loc>${escapeXml(`${siteUrl}/gallery/?album=${a.slug}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
      });
    } catch (err) {
      console.warn('[SEO] Failed to fetch dynamic content for sitemap:', err.message);
    }
  }

  const staticUrls = STATIC_PUBLIC_ROUTES.map((route) => {
    const loc = route === '/' ? siteUrl : `${siteUrl}${route}`;
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
  });

  const allUrls = [...staticUrls, ...dynamicNoticeUrls, ...dynamicAlbumUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return res.status(200).send(xml);
}

/**
 * GET /robots.txt
 */
function getRobotsTxt(req, res) {
  const siteUrl = getBaseSiteUrl(req);

  const robots = `# Robots.txt for L.K.S.K Convent School
# Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.status(200).send(robots);
}

module.exports = {
  getSitemap,
  getRobotsTxt,
  STATIC_PUBLIC_ROUTES,
};
