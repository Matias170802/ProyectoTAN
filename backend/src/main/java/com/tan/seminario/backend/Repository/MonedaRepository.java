package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Moneda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonedaRepository extends JpaRepository<Moneda, Long> {
}
