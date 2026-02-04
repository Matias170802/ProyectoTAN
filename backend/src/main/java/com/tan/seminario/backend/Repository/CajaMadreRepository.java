package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CajaMadreRepository extends JpaRepository<CajaMadre, Long> {
    List<CajaMadre> findCajaMadreByFechaHoraBajaCajaMadreIsNull();

    CajaMadre findByNroCajaMadre(Long nroCajaMadre);
}
