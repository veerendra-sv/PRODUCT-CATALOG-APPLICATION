package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import mth.models.Rolesmapping;
import mth.models.Rolesmapping.RolesmappingId;
import java.util.List;

@Repository
public interface RolesmappingRepository extends JpaRepository<Rolesmapping, RolesmappingId> {

    @Query("select R from Rolesmapping R where R.role = :role")
    List<Rolesmapping> findByRole(@Param("role") Long role);

    @Modifying
    @Transactional
    @Query("delete from Rolesmapping R where R.role = :role and R.mid = :mid")
    void deleteMapping(@Param("role") Long role, @Param("mid") Long mid);
}
