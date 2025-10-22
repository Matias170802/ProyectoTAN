package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.CategoriaMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaMovimientoRepository extends JpaRepository<CategoriaMovimiento, Long> {
    List<CategoriaMovimiento> findByFechaHoraBajaCategoriaMovimientoIsNull();
    CategoriaMovimiento findBynombreCategoriaMovimiento(String nombreCategoriaMovimiento);
}
