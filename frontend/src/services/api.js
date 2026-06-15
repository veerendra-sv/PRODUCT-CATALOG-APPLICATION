import { apibaseurl, callApi } from '../lib';

export const getToken = () => localStorage.getItem('token') || '';

// ── Auth ────────────────────────────────────────────────────────────────────
export const signin  = (data, cb) => callApi('POST', `${apibaseurl}/authservice/signin`, data, null, cb);
export const signup  = (data, cb) => callApi('POST', `${apibaseurl}/authservice/signup`, data, null, cb);
export const getUinfo = (cb)      => callApi('GET',  `${apibaseurl}/authservice/uinfo`, null, null, cb, getToken());

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts    = (cb, params = {}) => {
    let url = `${apibaseurl}/products`;
    const queryParts = [];
    if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.minPrice) queryParts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) queryParts.push(`maxPrice=${params.maxPrice}`);
    if (queryParts.length > 0) {
        url += `?${queryParts.join('&')}`;
    }
    return callApi('GET', url, null, null, cb, getToken());
};
export const importProducts = (cb)         => callApi('POST',   `${apibaseurl}/products/import`, null, null, cb, getToken());

// ── Import from DummyJSON (category-specific) + FakeStoreAPI ─────────────────
export const importFromDummyJSON = (cb) => {
    // DummyJSON: fetch specific categories only
    const dummyCategories = [
        'laptops', 'smartphones', 'tablets', 'mobile-accessories',
        'mens-watches', 'womens-watches', 'sunglasses',
        'sports-accessories', 'mens-shoes'
    ];
    const dummyFetches = dummyCategories.map(cat =>
        fetch(`https://dummyjson.com/products/category/${cat}`)
            .then(r => r.json())
            .then(data => (data.products || []).map(p => ({
                title: p.title,
                description: p.description,
                price: p.price,
                category: cat,
                brand: p.brand || 'Generic',
                image_url: p.thumbnail || p.images?.[0],
                stock: p.stock || 0,
                rating: p.rating || 0
            })))
            .catch(() => [])
    );

    // FakeStoreAPI: fetch all, keep only electronics + men's clothing
    const fakeFetch = fetch('https://fakestoreapi.com/products')
        .then(r => r.json())
        .then(products => products
            .filter(p => p.category === 'electronics' || p.category === "men's clothing")
            .map(p => ({
                title: p.title,
                description: p.description,
                price: p.price,
                category: p.category === 'electronics' ? 'electronics' : 'mens-clothing',
                brand: 'Generic',
                image_url: p.image,
                stock: 50,
                rating: p.rating?.rate || 0
            }))
        )
        .catch(() => []);

    Promise.all([...dummyFetches, fakeFetch])
        .then(results => {
            const allProducts = results.flat();
            const importData = { products: allProducts };
            callApi('POST', `${apibaseurl}/products/batch-import`, importData, null, cb, getToken());
        })
        .catch(err => {
            console.error("Multi-Source Import Error:", err);
            cb({ code: 503, message: "Failed to import products" });
        });
};

export const getProduct     = (id, cb)     => callApi('GET',    `${apibaseurl}/products/${id}`,  null, null, cb, getToken());
export const searchProducts = (kw, cb)     => callApi('GET',    `${apibaseurl}/products/search?keyword=${encodeURIComponent(kw)}`, null, null, cb, getToken());
export const createProduct  = (data, cb)   => callApi('POST',   `${apibaseurl}/products`,        data, null, cb, getToken());
export const updateProduct  = (id, data, cb) => callApi('PUT',  `${apibaseurl}/products/${id}`,  data, null, cb, getToken());
export const deleteProduct  = (id, cb)     => callApi('DELETE', `${apibaseurl}/products/${id}`,  null, null, cb, getToken());

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories  = (cb)       => callApi('GET',  `${apibaseurl}/categories`,  null, null, cb, getToken());
export const createCategory = (data, cb) => callApi('POST', `${apibaseurl}/categories`,  data, null, cb, getToken());

// ── Admin — Users ─────────────────────────────────────────────────────────────
export const getAllUsers = (cb) => callApi('GET', `${apibaseurl}/admin/users`, null, null, cb, getToken());

// ── Admin — Roles ─────────────────────────────────────────────────────────────
export const getAllRoles = (cb)       => callApi('GET',  `${apibaseurl}/admin/roles`, null, null, cb, getToken());
export const createRole  = (data, cb) => callApi('POST', `${apibaseurl}/admin/roles`, data, null, cb, getToken());

// ── Admin — Menus ─────────────────────────────────────────────────────────────
export const getAllMenus = (cb)       => callApi('GET',  `${apibaseurl}/admin/menus`, null, null, cb, getToken());
export const createMenu  = (data, cb) => callApi('POST', `${apibaseurl}/admin/menus`, data, null, cb, getToken());

// ── Admin — Role Mapping ──────────────────────────────────────────────────────
export const getAllMappings  = (cb)       => callApi('GET',    `${apibaseurl}/admin/rolesmapping`, null, null, cb, getToken());
export const createMapping   = (data, cb) => callApi('POST',   `${apibaseurl}/admin/rolesmapping`, data, null, cb, getToken());
export const deleteMapping   = (data, cb) => callApi('DELETE', `${apibaseurl}/admin/rolesmapping`, data, null, cb, getToken());

// ── Cart ──────────────────────────────────────────────────────────────────────
export const getCart        = (cb)              => callApi('GET',    `${apibaseurl}/cart`,          null,               null, cb, getToken());
export const addToCart      = (productId, qty, cb) => callApi('POST', `${apibaseurl}/cart`,         { productId, quantity: qty }, null, cb, getToken());
export const updateCartItem = (cartId, qty, cb) => callApi('PUT',    `${apibaseurl}/cart/${cartId}`, { quantity: qty },  null, cb, getToken());
export const removeFromCart = (cartId, cb)      => callApi('DELETE', `${apibaseurl}/cart/${cartId}`, null,              null, cb, getToken());
export const clearCart      = (cb)              => callApi('DELETE', `${apibaseurl}/cart`,           null,              null, cb, getToken());

// ── Orders ────────────────────────────────────────────────────────────────────
export const placeOrder        = (data, cb)   => callApi('POST', `${apibaseurl}/orders/place`,   data, null, cb, getToken());
export const getMyOrders       = (cb)         => callApi('GET',  `${apibaseurl}/orders/my`,      null, null, cb, getToken());
export const getAllOrders       = (cb)         => callApi('GET',  `${apibaseurl}/orders/all`,     null, null, cb, getToken());
export const getOrderById      = (id, cb)     => callApi('GET',  `${apibaseurl}/orders/${id}`,   null, null, cb, getToken());
export const updateOrderStatus = (id, status, cb) => callApi('PUT', `${apibaseurl}/orders/${id}/status`, { status }, null, cb, getToken());

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getRoleFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch { return null; }
};

export const isAdmin = () => getRoleFromToken() === 2;
export const isLoggedIn = () => !!getToken();

export const logout = () => {
    localStorage.clear();
    window.location.replace('/');
};

// ── Semantic Search (Node.js → MongoDB Atlas) ─────────────────────────────────
export const semanticSearch = (query, cb) =>
    callApi('GET', `${apibaseurl}/semantic-search?q=${encodeURIComponent(query)}`, null, null, cb, getToken());

export const logSearch = (data, cb) =>
    callApi('POST', `${apibaseurl}/search-logs`, data, null, cb || (() => {}), getToken());

export const seedSearchIndex = (cb) =>
    callApi('POST', `${apibaseurl}/search-seed`, { token: getToken() }, null, cb, getToken());

// ── Reports (MongoDB via Node.js) ─────────────────────────────────────────────
export const submitReport    = (data, cb) => callApi('POST', `${apibaseurl}/reports`, data, null, cb, getToken());
export const getReports      = (cb)       => callApi('GET',  `${apibaseurl}/reports`, null, null, cb, getToken());
export const updateReportStatus = (id, status, cb) =>
    callApi('PUT', `${apibaseurl}/reports/${id}`, { status }, null, cb, getToken());
