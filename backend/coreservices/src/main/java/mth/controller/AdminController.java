package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import mth.models.Menus;
import mth.models.Roles;
import mth.models.Rolesmapping;
import mth.services.AdminService;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired AdminService AS;

    // ── Users ────────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public Object getAllUsers(@RequestHeader("Token") String token) {
        return AS.getAllUsers(token);
    }

    // ── Roles ────────────────────────────────────────────────────────────────
    @GetMapping("/roles")
    public Object getAllRoles(@RequestHeader("Token") String token) {
        return AS.getAllRoles(token);
    }

    @PostMapping("/roles")
    public Object addRole(@RequestBody Roles role, @RequestHeader("Token") String token) {
        return AS.addRole(role, token);
    }

    // ── Menus ────────────────────────────────────────────────────────────────
    @GetMapping("/menus")
    public Object getAllMenus(@RequestHeader("Token") String token) {
        return AS.getAllMenus(token);
    }

    @PostMapping("/menus")
    public Object addMenu(@RequestBody Menus menu, @RequestHeader("Token") String token) {
        return AS.addMenu(menu, token);
    }

    // ── Role Mapping ─────────────────────────────────────────────────────────
    @GetMapping("/rolesmapping")
    public Object getAllMappings(@RequestHeader("Token") String token) {
        return AS.getAllMappings(token);
    }

    @PostMapping("/rolesmapping")
    public Object addMapping(@RequestBody Rolesmapping mapping, @RequestHeader("Token") String token) {
        return AS.addMapping(mapping, token);
    }

    @DeleteMapping("/rolesmapping")
    public Object deleteMapping(@RequestBody Map<String, Long> body, @RequestHeader("Token") String token) {
        return AS.deleteMapping(body.get("role"), body.get("mid"), token);
    }
}
