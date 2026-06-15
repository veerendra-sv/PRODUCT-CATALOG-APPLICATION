package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import mth.models.Cart;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUsername(String username);
    Optional<Cart> findByUsernameAndProductId(String username, Long productId);

    @Modifying
    @Transactional
    @Query("delete from Cart c where c.username = :username and c.productId = :productId")
    void deleteByUsernameAndProductId(@Param("username") String username, @Param("productId") Long productId);

    @Modifying
    @Transactional
    @Query("delete from Cart c where c.username = :username")
    void deleteByUsername(@Param("username") String username);
}
