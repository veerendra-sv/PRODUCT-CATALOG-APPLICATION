package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import mth.services.OrdersService;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Autowired OrdersService OS;

    @PostMapping("/place")
    public Object placeOrder(@RequestBody Map<String, Object> body,
                              @RequestHeader("Token") String token) {
        return OS.placeOrder(body, token);
    }

    @GetMapping("/my")
    public Object getMyOrders(@RequestHeader("Token") String token) {
        return OS.getMyOrders(token);
    }

    @GetMapping("/all")
    public Object getAllOrders(@RequestHeader("Token") String token) {
        return OS.getAllOrders(token);
    }

    @GetMapping("/{id}")
    public Object getOrderById(@PathVariable Long id,
                                @RequestHeader("Token") String token) {
        return OS.getOrderById(id, token);
    }

    @PutMapping("/{id}/status")
    public Object updateStatus(@PathVariable Long id,
                                @RequestBody Map<String, Object> body,
                                @RequestHeader("Token") String token) {
        return OS.updateStatus(id, (String) body.get("status"), token);
    }
}
