package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import mth.models.Products;
import mth.services.ProductsService;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    ProductsService PS;

    @GetMapping
    public Object getAllProducts(
            @RequestHeader("Token") String token,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return PS.getFilteredProducts(token, category, search, minPrice, maxPrice);
    }

    @PostMapping("/import")
    public Object importProducts(@RequestHeader("Token") String token) {
        return PS.importProducts(token);
    }

    @PostMapping("/batch-import")
    public Object batchImportProducts(@RequestBody Map<String, Object> payload, @RequestHeader("Token") String token) {
        return PS.batchImportProducts(payload, token);
    }

    @GetMapping("/{id}")
    public Object getProductById(@PathVariable Long id, @RequestHeader("Token") String token) {
        return PS.getProductById(id, token);
    }

    @GetMapping("/search")
    public Object searchProducts(@RequestParam String keyword, @RequestHeader("Token") String token) {
        return PS.searchProducts(keyword, token);
    }

    @PostMapping
    public Object addProduct(@RequestBody Products P, @RequestHeader("Token") String token) {
        return PS.addProduct(P, token);
    }

    @PutMapping("/{id}")
    public Object updateProduct(@PathVariable Long id, @RequestBody Products P, @RequestHeader("Token") String token) {
        return PS.updateProduct(id, P, token);
    }

    @DeleteMapping("/{id}")
    public Object deleteProduct(@PathVariable Long id, @RequestHeader("Token") String token) {
        return PS.deleteProduct(id, token);
    }
}
