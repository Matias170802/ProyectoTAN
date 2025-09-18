package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.CajaMadre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CajaMadreRepository extends JpaRepository<CajaMadre, Long> {
    List<CajaMadre> findCajaMadreByFechaHoraBajaCajaMadreIsNull();
}
