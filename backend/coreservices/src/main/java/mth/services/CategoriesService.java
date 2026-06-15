package mth.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.models.Categories;
import mth.repository.CategoriesRepository;

@Service
public class CategoriesService {

    @Autowired
    CategoriesRepository CR;

    @Autowired
    JwtService JWT;

    // ─── GET ALL ──────────────────────────────────────────────────────────────
    public Object getAllCategories(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            JWT.validateJWT(token);
            List<Categories> list = CR.findAll();
            response.put("code", 200);
            response.put("categories", list);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ─── ADD (ADMIN only, role=2) ─────────────────────────────────────────────
    public Object addCategory(Categories C, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = JWT.validateJWT(token);
            int role = ((Number) payload.get("role")).intValue();
            if (role != 2) {
                response.put("code", 403);
                response.put("message", "Access denied. Admin only.");
                return response;
            }
            Categories saved = CR.save(C);
            response.put("code", 200);
            response.put("message", "Category added successfully.");
            response.put("category", saved);
        } catch (Exception e) {
            response.put("code", 401);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
