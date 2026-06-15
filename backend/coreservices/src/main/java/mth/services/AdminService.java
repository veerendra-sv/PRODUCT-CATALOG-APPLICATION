package mth.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.models.Menus;
import mth.models.Roles;
import mth.models.Rolesmapping;
import mth.repository.MenusRepository;
import mth.repository.RolesRepository;
import mth.repository.RolesmappingRepository;
import mth.repository.UsersRepository;

@Service
public class AdminService {

    @Autowired RolesRepository      rolesRepo;
    @Autowired MenusRepository      menusRepo;
    @Autowired RolesmappingRepository rmRepo;
    @Autowired UsersRepository      usersRepo;
    @Autowired JwtService           JWT;

    // ── Guard: admin only ────────────────────────────────────────────────────
    private void requireAdmin(String token) throws Exception {
        Map<String, Object> payload = JWT.validateJWT(token);
        int role = ((Number) payload.get("role")).intValue();
        if (role != 2) throw new Exception("Access denied. Admin only.");
    }

    // ── Users ────────────────────────────────────────────────────────────────
    public Object getAllUsers(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            res.put("code", 200);
            res.put("users", usersRepo.findAll());
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }

    // ── Roles ────────────────────────────────────────────────────────────────
    public Object getAllRoles(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            JWT.validateJWT(token);
            res.put("code", 200);
            res.put("roles", rolesRepo.findAll());
        } catch (Exception e) {
            res.put("code", 401); res.put("message", e.getMessage());
        }
        return res;
    }

    public Object addRole(Roles role, String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            Roles saved = rolesRepo.save(role);
            res.put("code", 200); res.put("message", "Role added."); res.put("role", saved);
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }

    // ── Menus ────────────────────────────────────────────────────────────────
    public Object getAllMenus(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            JWT.validateJWT(token);
            res.put("code", 200);
            res.put("menus", menusRepo.findAll());
        } catch (Exception e) {
            res.put("code", 401); res.put("message", e.getMessage());
        }
        return res;
    }

    public Object addMenu(Menus menu, String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            Menus saved = menusRepo.save(menu);
            res.put("code", 200); res.put("message", "Menu added."); res.put("menu", saved);
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }

    // ── Role Mapping ─────────────────────────────────────────────────────────
    public Object getAllMappings(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            res.put("code", 200);
            res.put("mappings", rmRepo.findAll());
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }

    public Object addMapping(Rolesmapping mapping, String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            Rolesmapping saved = rmRepo.save(mapping);
            res.put("code", 200); res.put("message", "Mapping added."); res.put("mapping", saved);
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }

    public Object deleteMapping(Long role, Long mid, String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            requireAdmin(token);
            rmRepo.deleteMapping(role, mid);
            res.put("code", 200); res.put("message", "Mapping removed.");
        } catch (Exception e) {
            res.put("code", 403); res.put("message", e.getMessage());
        }
        return res;
    }
}
