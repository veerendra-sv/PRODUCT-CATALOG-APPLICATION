package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import mth.models.Categories;
import mth.services.CategoriesService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    CategoriesService CS;

    @GetMapping
    public Object getAllCategories(@RequestHeader("Token") String token) {
        return CS.getAllCategories(token);
    }

    @PostMapping
    public Object addCategory(@RequestBody Categories C, @RequestHeader("Token") String token) {
        return CS.addCategory(C, token);
    }
}
