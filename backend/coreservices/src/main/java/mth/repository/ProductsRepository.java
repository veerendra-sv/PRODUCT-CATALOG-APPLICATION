package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mth.models.Products;
import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Long> {

    @Query("select P from Products P where lower(P.productName) like lower(concat('%', :keyword, '%')) or lower(P.brand) like lower(concat('%', :keyword, '%'))")
    List<Products> searchProducts(@Param("keyword") String keyword);

    @Query("select P from Products P where P.categoryId = :categoryId")
    List<Products> findByCategoryId(@Param("categoryId") Long categoryId);
}
