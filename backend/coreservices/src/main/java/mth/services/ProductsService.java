package mth.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.models.Products;
import mth.models.Categories;
import mth.repository.ProductsRepository;
import mth.repository.CategoriesRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class ProductsService {

    @Autowired
    ProductsRepository PR;

    @Autowired
    CategoriesRepository CR;

    @PersistenceContext
    EntityManager em;

    @Autowired
    JwtService JWT;

    // ─── Validate token and return role, throws if invalid ───────────────────
    private Map<String, Object> validateToken(String token) throws Exception {
        return JWT.validateJWT(token);
    }

    // ─── GET ALL ──────────────────────────────────────────────────────────────
    public Object getAllProducts(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            validateToken(token); // any logged-in user
            List<Products> list = PR.findAll();
            response.put("code", 200);
            response.put("products", list);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── GET BY ID ────────────────────────────────────────────────────────────
    public Object getProductById(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            validateToken(token);
            Optional<Products> product = PR.findById(id);
            if (product.isPresent()) {
                response.put("code", 200);
                response.put("product", product.get());
            } else {
                response.put("code", 404);
                response.put("message", "Product not found");
            }
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── SEARCH ───────────────────────────────────────────────────────────────
    public Object searchProducts(String keyword, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            validateToken(token);
            List<Products> list = PR.searchProducts(keyword);
            response.put("code", 200);
            response.put("products", list);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── ADD (ADMIN only, role=2) ─────────────────────────────────────────────
    public Object addProduct(Products P, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = validateToken(token);
            int role = ((Number) payload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }
            Products saved = PR.save(P);
            response.put("code", 200);
            response.put("message", "Product added successfully.");
            response.put("product", saved);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── UPDATE (ADMIN only, role=2) ──────────────────────────────────────────
    public Object updateProduct(Long id, Products P, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = validateToken(token);
            int role = ((Number) payload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }
            Optional<Products> existing = PR.findById(id);
            if (!existing.isPresent()) {
                response.put("code", 404);
                response.put("message", "Product not found");
                return response;
            }
            P.setId(id);
            P.setCreatedAt(existing.get().getCreatedAt());
            Products updated = PR.save(P);
            response.put("code", 200);
            response.put("message", "Product updated successfully.");
            response.put("product", updated);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── DELETE (ADMIN only, role=2) ──────────────────────────────────────────
    public Object deleteProduct(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = validateToken(token);
            int role = ((Number) payload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }
            if (!PR.existsById(id)) {
                response.put("code", 404);
                response.put("message", "Product not found");
                return response;
            }
            PR.deleteById(id);
            response.put("code", 200);
            response.put("message", "Product deleted successfully.");
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── FILTERED GET ALL ──────────────────────────────────────────────────────
    public Object getFilteredProducts(String token, String categoryName, String search, Double minPrice, Double maxPrice) {
        Map<String, Object> response = new HashMap<>();
        try {
            validateToken(token);
            
            StringBuilder jpql = new StringBuilder("select p from Products p where 1=1");
            Map<String, Object> params = new HashMap<>();
            
            if (categoryName != null && !categoryName.trim().isEmpty()) {
                List<Categories> cats = em.createQuery("select c from Categories c where lower(c.categoryName) = lower(:cname)", Categories.class)
                        .setParameter("cname", categoryName.trim())
                        .getResultList();
                if (!cats.isEmpty()) {
                    jpql.append(" and p.categoryId = :catId");
                    params.put("catId", cats.get(0).getId());
                } else {
                    jpql.append(" and p.categoryId = -1");
                }
            }
            
            if (search != null && !search.trim().isEmpty()) {
                jpql.append(" and (lower(p.productName) like :search or lower(p.brand) like :search or lower(p.description) like :search)");
                params.put("search", "%" + search.trim().toLowerCase() + "%");
            }
            
            if (minPrice != null) {
                jpql.append(" and p.price >= :minPrice");
                params.put("minPrice", minPrice);
            }
            
            if (maxPrice != null) {
                jpql.append(" and p.price <= :maxPrice");
                params.put("maxPrice", maxPrice);
            }
            
            jpql.append(" order by p.id desc");
            
            jakarta.persistence.TypedQuery<Products> query = em.createQuery(jpql.toString(), Products.class);
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                query.setParameter(entry.getKey(), entry.getValue());
            }
            
            List<Products> list = query.getResultList();
            response.put("code", 200);
            response.put("products", list);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── NORMALIZE CATEGORY HELPER ─────────────────────────────────────────────
    private String normalizeCategory(String rawCat) {
        if (rawCat == null) return "Accessories";
        String cat = rawCat.toLowerCase().trim();
        
        // Excluded categories (only these 3)
        if (cat.contains("groceries") || cat.contains("motorcycle") || cat.contains("vehicle")) {
            return null;
        }
        
        // Mapped categories
        if (cat.contains("laptop")) return "Laptops";
        if (cat.contains("smartphone") || cat.equals("mobile-accessories")) return cat.contains("accessories") ? "Mobile Accessories" : "Smartphones";
        if (cat.contains("tablet")) return "Tablets";
        if (cat.contains("mobile") && cat.contains("accessor")) return "Mobile Accessories";
        if (cat.contains("watch")) return "Watches";
        if (cat.contains("sunglass")) return "Sunglasses";
        if (cat.contains("sport")) return "Sports Accessories";
        if (cat.contains("shoe") || cat.contains("footwear")) return "Footwear";
        if (cat.contains("electronic")) return "Electronics";
        if (cat.contains("mens-clothing") || cat.contains("men's clothing") || cat.contains("mens-shirt")) return "Men's Clothing";
        
        return "Accessories";
    }

    // ─── IMPORT EXTERNAL TECH PRODUCTS ─────────────────────────────────────────
    public Object importProducts(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Guard: admin only
            Map<String, Object> payload = validateToken(token);
            int role = ((Number) payload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }

            // Fetch from dummyjson.com
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://dummyjson.com/products?limit=100"))
                    .GET()
                    .build();
            java.net.http.HttpResponse<String> httpResponse = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            
            if (httpResponse.statusCode() != 200) {
                response.put("code", 502);
                response.put("message", "Failed to fetch products from external API. Status: " + httpResponse.statusCode());
                return response;
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(httpResponse.body());
            com.fasterxml.jackson.databind.JsonNode productsNode = rootNode.get("products");

            int importedCount = 0;

            if (productsNode != null && productsNode.isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode pNode : productsNode) {
                    String rawCategory = pNode.has("category") ? pNode.get("category").asText() : "";
                    String normCategory = normalizeCategory(rawCategory);
                    
                    // Skip if category is irrelevant/ignored
                    if (normCategory == null) continue;

                    String name = pNode.has("title") ? pNode.get("title").asText() : "Tech Product";
                    
                    // Check if duplicate product already exists
                    List<Products> existing = em.createQuery("select p from Products p where lower(p.productName) = lower(:name)", Products.class)
                            .setParameter("name", name.trim())
                            .getResultList();
                    if (!existing.isEmpty()) continue; // Skip duplicates

                    String brand = pNode.has("brand") ? pNode.get("brand").asText() : "Generic";
                    String description = pNode.has("description") ? pNode.get("description").asText() : "";
                    Double price = pNode.has("price") ? pNode.get("price").asDouble() : 0.0;
                    Integer stock = pNode.has("stock") ? pNode.get("stock").asInt() : 10;
                    
                    // Find image url
                    String imageUrl = "";
                    if (pNode.has("thumbnail")) {
                        imageUrl = pNode.get("thumbnail").asText();
                    } else if (pNode.has("images") && pNode.get("images").isArray() && pNode.get("images").size() > 0) {
                        imageUrl = pNode.get("images").get(0).asText();
                    }

                    // Auto-generate or retrieve category
                    Long categoryId = null;
                    List<Categories> catList = em.createQuery("select c from Categories c where lower(c.categoryName) = lower(:cname)", Categories.class)
                            .setParameter("cname", normCategory)
                            .getResultList();
                    if (catList.isEmpty()) {
                        Categories newCat = new Categories();
                        newCat.setCategoryName(normCategory);
                        newCat.setDescription("High-quality " + normCategory + " products.");
                        Categories savedCat = CR.save(newCat);
                        categoryId = savedCat.getId();
                    } else {
                        categoryId = catList.get(0).getId();
                    }

                    // Build and save product
                    Products product = new Products();
                    product.setProductName(name);
                    product.setBrand(brand);
                    product.setDescription(description);
                    product.setPrice(price);
                    product.setStockQuantity(stock);
                    product.setImageUrl(imageUrl);
                    product.setCategoryId(categoryId);

                    PR.save(product);
                    importedCount++;
                }
            }

            response.put("code", 200);
            response.put("message", "Import completed successfully. " + importedCount + " new tech products imported.");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "Import failed: " + e.getMessage());
        }
        return response;
    }

    // ─── BATCH IMPORT FROM FRONTEND ────────────────────────────────────────────
    public Object batchImportProducts(Map<String, Object> payload, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Guard: admin only
            Map<String, Object> validatePayload = validateToken(token);
            int role = ((Number) validatePayload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> products = (List<Map<String, Object>>) payload.get("products");
            if (products == null || products.isEmpty()) {
                response.put("code", 400);
                response.put("message", "No products provided for import.");
                return response;
            }

            int importedCount = 0;

            for (Map<String, Object> pMap : products) {
                String category = (String) pMap.getOrDefault("category", "");
                String normCategory = normalizeCategory(category);
                
                // Skip if category is irrelevant/ignored
                if (normCategory == null) continue;

                String name = (String) pMap.getOrDefault("title", "Product");
                
                // Check if duplicate product already exists
                List<Products> existing = em.createQuery("select p from Products p where lower(p.productName) = lower(:name)", Products.class)
                        .setParameter("name", name.trim())
                        .getResultList();
                if (!existing.isEmpty()) continue; // Skip duplicates

                String brand = (String) pMap.getOrDefault("brand", "Generic");
                String description = (String) pMap.getOrDefault("description", "");
                Double price = ((Number) pMap.getOrDefault("price", 0.0)).doubleValue();
                Integer stock = ((Number) pMap.getOrDefault("stock", 10)).intValue();
                String imageUrl = (String) pMap.getOrDefault("image_url", "");

                // Auto-generate or retrieve category
                Long categoryId = null;
                List<Categories> catList = em.createQuery("select c from Categories c where lower(c.categoryName) = lower(:cname)", Categories.class)
                        .setParameter("cname", normCategory)
                        .getResultList();
                if (catList.isEmpty()) {
                    Categories newCat = new Categories();
                    newCat.setCategoryName(normCategory);
                    newCat.setDescription("High-quality " + normCategory + " products.");
                    Categories savedCat = CR.save(newCat);
                    categoryId = savedCat.getId();
                } else {
                    categoryId = catList.get(0).getId();
                }

                // Build and save product
                Products product = new Products();
                product.setProductName(name);
                product.setBrand(brand);
                product.setDescription(description);
                product.setPrice(price);
                product.setStockQuantity(stock);
                product.setImageUrl(imageUrl);
                product.setCategoryId(categoryId);

                PR.save(product);
                importedCount++;
            }

            response.put("code", 200);
            response.put("message", "Batch import completed. " + importedCount + " products imported.");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "Batch import failed: " + e.getMessage());
        }
        return response;
    }
}
