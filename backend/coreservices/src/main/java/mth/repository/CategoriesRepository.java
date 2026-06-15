package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mth.models.Categories;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
}
