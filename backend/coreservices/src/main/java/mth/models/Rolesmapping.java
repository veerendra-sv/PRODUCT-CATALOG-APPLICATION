package mth.models;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "rolesmapping")
@IdClass(Rolesmapping.RolesmappingId.class)
public class Rolesmapping {

    @Id
    private Long role;

    @Id
    private Long mid;

    public Long getRole() { return role; }
    public void setRole(Long role) { this.role = role; }

    public Long getMid() { return mid; }
    public void setMid(Long mid) { this.mid = mid; }

    // Composite PK class
    public static class RolesmappingId implements Serializable {
        private Long role;
        private Long mid;

        public RolesmappingId() {}
        public RolesmappingId(Long role, Long mid) { this.role = role; this.mid = mid; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof RolesmappingId)) return false;
            RolesmappingId that = (RolesmappingId) o;
            return Objects.equals(role, that.role) && Objects.equals(mid, that.mid);
        }

        @Override
        public int hashCode() { return Objects.hash(role, mid); }
    }
}
