package com.shree.Service.Impl;

import com.shree.Model.Category;
import com.shree.Repository.CategoryRepository;
import com.shree.Service.CategoryService;

import com.shree.dto.SalonDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    public final CategoryRepository categoryRepository;

    @Override
    public Category saveCategory(Category category, SalonDTO salonDTO) {
        Category category1 = new Category();
        category1.setName(category.getName());
        category1.setSalonId(salonDTO.getId());
        category1.setImage(category.getImage());

        return categoryRepository.save(category1);
    }


    @Override
    public Set<Category> getAllCategoriesBySalon(Long id) {
        return categoryRepository.findBySalonId(id);
    }

    @Override
    public Category getCategoryById(Long id) throws Exception {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            throw new Exception("category not exist");
        }

        return category;
    }

    @Override
    public void deleteCategoryById(Long id,Long salonId) throws Exception {
       Category category = getCategoryById(id);
       if(category.getSalonId()!=salonId)
       {
           throw new Exception("you dont have access to delete..");
       }
        categoryRepository.deleteById(id);
    }

    @Override
    public Category findByIdAndSalonId(Long id, Long salonId) throws Exception {
        Category category = categoryRepository.findByIdAndSalonId(id,salonId);

        if (category==null){
            throw  new Exception("category not found..");}
        return category;
    }
}
