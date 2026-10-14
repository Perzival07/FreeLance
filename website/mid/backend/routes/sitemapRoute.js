import express from 'express';
import productModel from '../models/productModel.js';

const sitemapRouter = express.Router();

// Static storefront pages; keep in sync with frontend/src/App.jsx
const STATIC_PATHS = [
    '/', '/collection', '/showroom', '/about', '/contact', '/custom-furniture', '/book-visit',
    '/bulk-orders', '/track-order', '/faq', '/shipping-policy', '/return-policy', '/warranty',
    '/terms', '/privacy-policy', '/care-guide', '/careers',
];

const slugify = (str) =>
    String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const escapeXml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

sitemapRouter.get('/sitemap.xml', async (req, res) => {
    try {
        const origin = process.env.FRONTEND_URL || `https://${req.headers.host}`;
        const products = await productModel.find({}, { name: 1, date: 1, slug: 1 }).lean();
        const urls = [
            ...STATIC_PATHS.map((path) => `<url><loc>${escapeXml(origin + path)}</loc></url>`),
            ...products.map((p) => {
                const lastmod = p.date ? `<lastmod>${new Date(p.date).toISOString().slice(0, 10)}</lastmod>` : '';
                return `<url><loc>${escapeXml(`${origin}/product/${p.slug || slugify(p.name)}-${p._id}`)}</loc>${lastmod}</url>`;
            }),
        ];
        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Sitemap unavailable');
    }
});

export default sitemapRouter;
