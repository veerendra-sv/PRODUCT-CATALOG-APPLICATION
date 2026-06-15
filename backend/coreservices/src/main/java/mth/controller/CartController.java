package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import mth.services.CartService;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired CartService CS;

    @GetMapping
    public Object getCart(@RequestHeader("Token") String token) {
        return CS.getCart(token);
    }

    @PostMapping
    public Object addToCart(@RequestBody Map<String, Object> body, @RequestHeader("Token") String token) {
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = body.containsKey("quantity") ? Integer.valueOf(body.get("quantity").toString()) : 1;
        return CS.addToCart(productId, quantity, token);
    }

    @PutMapping("/{cartId}")
    public Object updateQuantity(@PathVariable Long cartId, @RequestBody Map<String, Object> body,
                                  @RequestHeader("Token") String token) {
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        return CS.updateQuantity(cartId, quantity, token);
    }

    @DeleteMapping("/{cartId}")
    public Object removeItem(@PathVariable Long cartId, @RequestHeader("Token") String token) {
        return CS.removeFromCart(cartId, token);
    }

    @DeleteMapping
    public Object clearCart(@RequestHeader("Token") String token) {
        return CS.clearCart(token);
    }
}
