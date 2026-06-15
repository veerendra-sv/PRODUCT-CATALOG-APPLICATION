package mth.services;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import mth.models.Cart;
import mth.models.Products;
import mth.repository.CartRepository;
import mth.repository.ProductsRepository;

@Service
public class CartService {

    @Autowired CartRepository CR;
    @Autowired ProductsRepository PR;
    @Autowired JwtService JWT;

    private String getUsername(String token) throws Exception {
        Map<String, Object> payload = JWT.validateJWT(token);
        return (String) payload.get("username");
    }

    // ── GET CART ──────────────────────────────────────────────────────────────
    public Object getCart(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            List<Cart> items = CR.findByUsername(username);

            List<Map<String, Object>> enriched = new ArrayList<>();
            double total = 0;
            for (Cart item : items) {
                Optional<Products> p = PR.findById(item.getProductId());
                if (p.isPresent()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("cartId", item.getId());
                    row.put("productId", item.getProductId());
                    row.put("quantity", item.getQuantity());
                    row.put("productName", p.get().getProductName());
                    row.put("brand", p.get().getBrand());
                    row.put("imageUrl", p.get().getImageUrl());
                    row.put("price", p.get().getPrice());
                    row.put("subtotal", p.get().getPrice() * item.getQuantity());
                    enriched.add(row);
                    total += p.get().getPrice() * item.getQuantity();
                }
            }
            response.put("code", 200);
            response.put("items", enriched);
            response.put("total", total);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── ADD / UPDATE ITEM ─────────────────────────────────────────────────────
    @Transactional
    public Object addToCart(Long productId, Integer quantity, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            if (!PR.existsById(productId)) {
                response.put("code", 404); response.put("message", "Product not found"); return response;
            }
            Optional<Cart> existing = CR.findByUsernameAndProductId(username, productId);
            Cart item = existing.orElse(new Cart());
            item.setUsername(username);
            item.setProductId(productId);
            item.setQuantity(existing.isPresent() ? item.getQuantity() + quantity : quantity);
            CR.save(item);
            response.put("code", 200);
            response.put("message", "Cart updated");
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── UPDATE QUANTITY ───────────────────────────────────────────────────────
    @Transactional
    public Object updateQuantity(Long cartId, Integer quantity, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            Optional<Cart> item = CR.findById(cartId);
            if (item.isEmpty() || !item.get().getUsername().equals(username)) {
                response.put("code", 404); response.put("message", "Cart item not found"); return response;
            }
            if (quantity <= 0) {
                CR.deleteById(cartId);
                response.put("code", 200); response.put("message", "Item removed");
            } else {
                item.get().setQuantity(quantity);
                CR.save(item.get());
                response.put("code", 200); response.put("message", "Quantity updated");
            }
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── REMOVE ITEM ───────────────────────────────────────────────────────────
    @Transactional
    public Object removeFromCart(Long cartId, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            Optional<Cart> item = CR.findById(cartId);
            if (item.isEmpty() || !item.get().getUsername().equals(username)) {
                response.put("code", 404); response.put("message", "Cart item not found"); return response;
            }
            CR.deleteById(cartId);
            response.put("code", 200); response.put("message", "Item removed");
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── CLEAR CART ────────────────────────────────────────────────────────────
    @Transactional
    public Object clearCart(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            CR.deleteByUsername(username);
            response.put("code", 200); response.put("message", "Cart cleared");
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
