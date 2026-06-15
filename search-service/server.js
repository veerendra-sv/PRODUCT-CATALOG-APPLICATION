require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app         = express();
const PORT        = process.env.PORT        || 3001;
const MONGO_URI   = process.env.MONGO_URI;
const SPRING_BASE = process.env.SPRING_BASE || 'https://product-catalog-application.onrender.com';

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

// product_descriptions
const productDescSchema = new mongoose.Schema({
    productId:    { type: Number, unique: true },
    productName:  String,
    brand:        String,
    description:  String,
    category:     String,
    categoryId:   Number,
    price:        Number,
    stockQuantity: Number,
    imageUrl:     String,
    tags:         [String],
    createdAt:    { type: Date, default: Date.now }
});
productDescSchema.index(
    { productName: 'text', description: 'text', category: 'text', brand: 'text', tags: 'text' },
    { weights: { productName: 10, brand: 8, category: 5, description: 3, tags: 2 } }
);

// product_embeddings
const productEmbeddingSchema = new mongoose.Schema({
    productId: { type: Number, unique: true },
    keywords:  [String],
    scoreMap:  mongoose.Schema.Types.Mixed
});

// user_search_logs
const searchLogSchema = new mongoose.Schema({
    query:        String,
    resultsCount: Number,
    userId:       String,
    timestamp:    { type: Date, default: Date.now }
});

// user_reports
const reportSchema = new mongoose.Schema({
    userId:      String,
    username:    String,
    email:       String,
    type:        {
        type: String,
        enum: ['Product Issue', 'Order Issue', 'General Feedback', 'Other'],
        default: 'General Feedback'
    },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    status:      {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved'],
        default: 'Pending'
    },
    submittedAt: { type: Date, default: Date.now },
    resolvedAt:  Date
});

const ProductDesc      = mongoose.model('product_descriptions', productDescSchema);
const ProductEmbedding = mongoose.model('product_embeddings',   productEmbeddingSchema);
const SearchLog        = mongoose.model('user_search_logs',     searchLogSchema);
const Report           = mongoose.model('user_reports',         reportSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
    'from','is','are','was','were','be','been','have','has','do','does','did',
    'will','would','could','should','may','might','can','this','that','these',
    'those','it','its','they','their','we','you','he','she','as','up','out',
    'about','than','so','if','all','just','more','into','over','very','good'
]);

function extractKeywords(text) {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

// ─────────────────────────────────────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    const states = ['disconnected','connected','connecting','disconnecting'];
    res.json({ status: 'Search service running', mongo: states[mongoose.connection.readyState], port: PORT });
});

// ─────────────────────────────────────────────────────────────────────────────
// Search Routes
// ─────────────────────────────────────────────────────────────────────────────
app.get('/search', async (req, res) => {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ code: 400, message: 'Query parameter q is required' });

    try {
        let products = [];
        try {
            products = await ProductDesc.find(
                { $text: { $search: q } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(50).lean();
        } catch (_) {}

        if (products.length === 0) {
            const regex = new RegExp(q.split(/\s+/).join('|'), 'i');
            products = await ProductDesc.find({
                $or: [{ productName: regex }, { brand: regex }, { description: regex }, { category: regex }, { tags: regex }]
            }).limit(50).lean();
        }

        const formatted = products.map(p => ({
            id: p.productId, productName: p.productName, brand: p.brand,
            description: p.description, category: p.category, categoryId: p.categoryId,
            price: p.price, stockQuantity: p.stockQuantity, imageUrl: p.imageUrl
        }));

        SearchLog.create({ query: q, resultsCount: formatted.length }).catch(() => {});
        res.json({ code: 200, products: formatted, total: formatted.length, query: q });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Search failed', error: err.message });
    }
});

app.post('/logs', async (req, res) => {
    try {
        const { query, resultsCount, userId } = req.body;
        const log = await SearchLog.create({ query, resultsCount, userId });
        res.json({ code: 200, message: 'Logged', id: log._id });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Logging failed' });
    }
});

app.get('/logs', async (req, res) => {
    try {
        const logs = await SearchLog.find().sort({ timestamp: -1 }).limit(100).lean();
        res.json({ code: 200, logs, total: logs.length });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to fetch logs' });
    }
});

app.post('/seed', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ code: 400, message: 'Token required' });
    try {
        const response = await fetch(`${SPRING_BASE}/products`, { headers: { Token: token } });
        const data = await response.json();
        if (data.code !== 200 || !Array.isArray(data.products))
            return res.status(502).json({ code: 502, message: 'Failed to fetch from Spring Boot', details: data });

        let inserted = 0;
        for (const p of data.products) {
            const keywords = extractKeywords(`${p.productName||''} ${p.brand||''} ${p.description||''} ${p.category||''}`);
            const scoreMap = {};
            keywords.forEach(k => { scoreMap[k] = (scoreMap[k] || 0) + 1; });
            await ProductDesc.findOneAndUpdate({ productId: p.id },
                { productId: p.id, productName: p.productName, brand: p.brand, description: p.description,
                  category: p.category, categoryId: p.categoryId, price: p.price,
                  stockQuantity: p.stockQuantity, imageUrl: p.imageUrl, tags: keywords.slice(0, 25) },
                { upsert: true });
            await ProductEmbedding.findOneAndUpdate({ productId: p.id },
                { productId: p.id, keywords, scoreMap }, { upsert: true });
            inserted++;
        }
        res.json({ code: 200, message: 'Seeding complete', inserted, total: data.products.length });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Seeding failed', error: err.message });
    }
});

app.get('/stats', async (req, res) => {
    try {
        const [productCount, logCount, reportCount, recentLogs] = await Promise.all([
            ProductDesc.countDocuments(), SearchLog.countDocuments(),
            Report.countDocuments(), SearchLog.find().sort({ timestamp: -1 }).limit(10).lean()
        ]);
        res.json({ code: 200, productCount, logCount, reportCount, recentSearches: recentLogs });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Stats failed' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Report Routes
// ─────────────────────────────────────────────────────────────────────────────

// POST /reports  — user submits a report
app.post('/reports', async (req, res) => {
    try {
        const { userId, username, email, type, title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ code: 400, message: 'Title and description are required' });
        }
        const report = await Report.create({ userId, username, email, type, title, description });
        res.json({ code: 200, message: 'Report submitted successfully', reportId: report._id });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to submit report', error: err.message });
    }
});

// GET /reports  — admin gets all reports
app.get('/reports', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const reports = await Report.find(filter).sort({ submittedAt: -1 }).lean();
        const counts = {
            total:    await Report.countDocuments(),
            pending:  await Report.countDocuments({ status: 'Pending' }),
            inReview: await Report.countDocuments({ status: 'In Review' }),
            resolved: await Report.countDocuments({ status: 'Resolved' })
        };
        res.json({ code: 200, reports, counts });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to fetch reports', error: err.message });
    }
});

// PUT /reports/:id  — admin updates report status
app.put('/reports/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'Resolved') update.resolvedAt = new Date();
        const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!report) return res.status(404).json({ code: 404, message: 'Report not found' });
        res.json({ code: 200, message: 'Report updated', report });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to update report', error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅  Connected to MongoDB Atlas — database: smartcatalog');
        app.listen(PORT, () => {
            console.log(`🚀  Search service running  →  http://localhost:${PORT}`);
            console.log(`📋  Endpoints: /health /search /logs /seed /stats /reports`);
        });
    })
    .catch(err => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });
