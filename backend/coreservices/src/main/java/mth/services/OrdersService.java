package mth.services;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import mth.models.*;
import mth.repository.*;

@Service
public class OrdersService {

    private static final Logger log = LoggerFactory.getLogger(OrdersService.class);

    @Autowired OrdersRepository OR;
    @Autowired OrderItemsRepository OIR;
    @Autowired CartRepository CR;
    @Autowired ProductsRepository PR;
    @Autowired JwtService JWT;
    @Autowired EmailService emailService;

    private String getUsername(String token) throws Exception {
        return (String) JWT.validateJWT(token).get("username");
    }

    private int getRole(String token) throws Exception {
        return ((Number) JWT.validateJWT(token).get("role")).intValue();
    }

    // ── PLACE ORDER (reads cart → creates order → clears cart) ────────────────
    @Transactional
    public Object placeOrder(Map<String, Object> body, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            List<Cart> cartItems = CR.findByUsername(username);
            if (cartItems.isEmpty()) {
                response.put("code", 400);
                response.put("message", "Cart is empty");
                return response;
            }

            String address       = (String) body.getOrDefault("address", "");
            String paymentMethod = (String) body.getOrDefault("paymentMethod", "COD");

            // Build order
            Orders order = new Orders();
            order.setUsername(username);
            order.setAddress(address);
            order.setPaymentMethod(paymentMethod);
            order.setStatus("CONFIRMED");

            double total = 0;
            List<OrderItems> lineItems = new ArrayList<>();

            for (Cart c : cartItems) {
                Optional<Products> p = PR.findById(c.getProductId());
                if (p.isEmpty()) continue;
                double subtotal = p.get().getPrice() * c.getQuantity();
                total += subtotal;

                OrderItems item = new OrderItems();
                item.setProductId(c.getProductId());
                item.setProductName(p.get().getProductName());
                item.setBrand(p.get().getBrand());
                item.setImageUrl(p.get().getImageUrl());
                item.setQuantity(c.getQuantity());
                item.setPrice(p.get().getPrice());
                item.setSubtotal(subtotal);
                lineItems.add(item);
            }

            order.setTotal(total);
            Orders saved = OR.save(order);

            // Attach orderId to items and save
            for (OrderItems item : lineItems) {
                item.setOrderId(saved.getId());
            }
            OIR.saveAll(lineItems);

            // Clear cart
            CR.deleteByUsername(username);

            // Send confirmation email asynchronously to isolate SMTP errors from the DB transaction
            final String recipient = username;
            final Orders orderToMail = saved;
            final List<OrderItems> itemsToMail = new ArrayList<>(lineItems);
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendOrderConfirmation(recipient, orderToMail, itemsToMail);
                    log.info("Order confirmation email sent to " + recipient);
                } catch (Exception e) {
                    log.error("Failed to send confirmation email for Order ID " + orderToMail.getId() + ": " + e.getMessage());
                }
            });

            response.put("code", 200);
            response.put("message", "Order placed successfully!");
            response.put("orderId", saved.getId());
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "Order failed: " + e.getMessage());
        }
        return response;
    }

    // ── MY ORDERS (user) ──────────────────────────────────────────────────────
    public Object getMyOrders(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            List<Orders> orders = OR.findByUsernameOrderByCreatedAtDesc(username);
            List<Map<String, Object>> result = enrichOrders(orders);
            response.put("code", 200);
            response.put("orders", result);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── ALL ORDERS (admin) ────────────────────────────────────────────────────
    public Object getAllOrders(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (getRole(token) != 2) {
                response.put("code", 403); response.put("message", "Admin only"); return response;
            }
            List<Orders> orders = OR.findAllByOrderByCreatedAtDesc();
            List<Map<String, Object>> result = enrichOrders(orders);
            response.put("code", 200);
            response.put("orders", result);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── ORDER DETAIL ──────────────────────────────────────────────────────────
    public Object getOrderById(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = getUsername(token);
            int role = getRole(token);
            Optional<Orders> order = OR.findById(id);
            if (order.isEmpty()) {
                response.put("code", 404); response.put("message", "Order not found"); return response;
            }
            // Only owner or admin can view
            if (role != 2 && !order.get().getUsername().equals(username)) {
                response.put("code", 403); response.put("message", "Access denied"); return response;
            }
            List<OrderItems> items = OIR.findByOrderId(id);
            response.put("code", 200);
            response.put("order", order.get());
            response.put("items", items);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── UPDATE STATUS (admin) ─────────────────────────────────────────────────
    @Transactional
    public Object updateStatus(Long id, String status, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (getRole(token) != 2) {
                response.put("code", 403); response.put("message", "Admin only"); return response;
            }
            Optional<Orders> order = OR.findById(id);
            if (order.isEmpty()) {
                response.put("code", 404); response.put("message", "Order not found"); return response;
            }
            order.get().setStatus(status);
            OR.save(order.get());
            response.put("code", 200);
            response.put("message", "Status updated to " + status);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ── Helper: enrich orders with their items ─────────────────────────────────
    private List<Map<String, Object>> enrichOrders(List<Orders> orders) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Orders o : orders) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", o.getId());
            row.put("username", o.getUsername());
            row.put("total", o.getTotal());
            row.put("status", o.getStatus());
            row.put("address", o.getAddress());
            row.put("paymentMethod", o.getPaymentMethod());
            row.put("createdAt", o.getCreatedAt());
            row.put("items", OIR.findByOrderId(o.getId()));
            result.add(row);
        }
        return result;
    }
}
