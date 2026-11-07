package com.shree.Controller;

import com.shree.Model.Category;
import com.shree.Service.CategoryService;

import com.shree.Service.client.SalonFeignClient;
import com.shree.dto.SalonDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories/salon-owner")
public class SalonCategoryController {
    private final CategoryService categoryService;
    private final SalonFeignClient salonFeignClient;

    @PostMapping()
    public ResponseEntity<Category> createCategory(@RequestBody Category category,
                                                   @RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO= salonFeignClient.getSalonOwnerById(jwt).getBody();

        Category saveCategory = categoryService.saveCategory(category,salonDTO);
        return ResponseEntity.ok(saveCategory);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO=salonFeignClient.getSalonOwnerById(jwt).getBody();

      categoryService.deleteCategoryById(id, salonDTO.getId());
        return ResponseEntity.ok("category deleted....");
    }

    @GetMapping("/salon/{salonId}/category/{id}")
    public ResponseEntity<Category> getCategoriesByIdAndSalon(@PathVariable Long id,
                                                              @PathVariable Long salonId
                                                              ) throws Exception {
        Category category = categoryService.findByIdAndSalonId(id, salonId);
        return ResponseEntity.ok(category);
    }

}
