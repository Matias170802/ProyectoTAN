package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.EmpleadoCaja;
import com.tan.seminario.backend.Entity.InmuebleCaja;
import com.tan.seminario.backend.Entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    Optional<Movimiento> findTopByCajaMadreOrderByFechaMovimientoDesc(CajaMadre cajaMadre);
    Optional<Movimiento> findTopByEmpleadoCajaOrderByFechaMovimientoDesc(EmpleadoCaja empleadoCaja);
    Optional<Movimiento> findTopByInmuebleCajaOrderByFechaMovimientoDesc(InmuebleCaja inmuebleCaja);
    Optional<List<Movimiento>> findByEmpleadoCajaOrderByFechaMovimientoDesc(EmpleadoCaja empleadoCaja);
    @Query("SELECT MAX(m.nroMovimiento) FROM Movimiento m")
    Long findMaxNroMovimiento();
}
