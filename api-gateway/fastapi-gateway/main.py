from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Smart Product Catalog — API Gateway", version="1.0.0")

# ─── CORS (allow React dev server) ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Spring Boot base URL ──────────────────────────────────────────────────────
SPRING_BASE = "http://localhost:8001"

# ─── Node.js Search Service base URL ─────────────────────────────────────────
NODE_BASE = "http://localhost:3001"

# ─── Generic request forwarder ────────────────────────────────────────────────
async def forward(request: Request, target_url: str) -> Response:
    body = await request.body()
    headers = {
        k: v for k, v in request.headers.items()
        if k.lower() not in ("host", "content-length")
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=dict(request.query_params),
        )
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers),
        media_type=resp.headers.get("content-type"),
    )

# ─── AUTH ROUTES  →  /authservice/* ──────────────────────────────────────────
@app.api_route("/authservice/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/authservice/{path}")

# ─── PRODUCT ROUTES  →  /products/* ──────────────────────────────────────────
@app.api_route("/products", methods=["GET", "POST"])
async def products_root(request: Request):
    return await forward(request, f"{SPRING_BASE}/products")

@app.api_route("/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def products_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/products/{path}")

# ─── CATEGORY ROUTES  →  /categories/* ───────────────────────────────────────
@app.api_route("/categories", methods=["GET", "POST"])
async def categories_root(request: Request):
    return await forward(request, f"{SPRING_BASE}/categories")

@app.api_route("/categories/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def categories_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/categories/{path}")

# ─── ADMIN ROUTES  →  /admin/* ───────────────────────────────────────────────
@app.api_route("/admin", methods=["GET", "POST", "PUT", "DELETE"])
async def admin_root(request: Request):
    return await forward(request, f"{SPRING_BASE}/admin")

@app.api_route("/admin/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def admin_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/admin/{path}")

# ─── CART ROUTES  →  /cart/* ──────────────────────────────────────────────────
@app.api_route("/cart", methods=["GET", "POST", "DELETE"])
async def cart_root(request: Request):
    return await forward(request, f"{SPRING_BASE}/cart")

@app.api_route("/cart/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def cart_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/cart/{path}")

# ─── ORDER ROUTES  →  /orders/* ───────────────────────────────────────────────
@app.api_route("/orders", methods=["GET", "POST"])
async def orders_root(request: Request):
    return await forward(request, f"{SPRING_BASE}/orders")

@app.api_route("/orders/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def orders_gateway(path: str, request: Request):
    return await forward(request, f"{SPRING_BASE}/orders/{path}")

# ─── SEMANTIC SEARCH  →  /semantic-search ────────────────────────────────────
@app.api_route("/semantic-search", methods=["GET"])
async def semantic_search(request: Request):
    return await forward(request, f"{NODE_BASE}/search")

# ─── SEARCH LOGS  →  /search-logs ────────────────────────────────────────────
@app.api_route("/search-logs", methods=["GET", "POST"])
async def search_logs(request: Request):
    return await forward(request, f"{NODE_BASE}/logs")

# ─── SEARCH SEED  →  /search-seed (admin trigger) ────────────────────────────
@app.api_route("/search-seed", methods=["POST"])
async def search_seed(request: Request):
    return await forward(request, f"{NODE_BASE}/seed")

# ─── REPORTS  →  /reports (users submit, admin view) ─────────────────────────
@app.api_route("/reports", methods=["GET", "POST"])
async def reports_root(request: Request):
    return await forward(request, f"{NODE_BASE}/reports")

@app.api_route("/reports/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def reports_gateway(path: str, request: Request):
    return await forward(request, f"{NODE_BASE}/reports/{path}")

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "Gateway is running", "upstream": SPRING_BASE, "search": NODE_BASE}
