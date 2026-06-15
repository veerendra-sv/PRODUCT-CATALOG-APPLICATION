package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import mth.models.Orders;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUsernameOrderByCreatedAtDesc(String username);
    List<Orders> findAllByOrderByCreatedAtDesc();
}
