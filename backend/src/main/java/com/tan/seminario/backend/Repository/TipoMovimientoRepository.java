package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TipoMovimientoRepository extends JpaRepository<TipoMovimiento, Long> {
    TipoMovimiento findBynombreTipoMovimiento(String nombreTipoMovimiento);
    List<TipoMovimiento> findByfechaHoraBajaTipoMovimientoIsNull();
    TipoMovimiento findBynombreTipoMovimientoAndFechaHoraBajaTipoMovimientoIsNull(String nombreTipoMovimiento);

    TipoMovimiento findByCodTipoMovimiento(String codTipoMovimiento);
}
