package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.EmpleadoCaja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpleadoCajaRepository extends JpaRepository<EmpleadoCaja, Long> {

    List<EmpleadoCaja> findEmpleadoCajaByFechaHoraBajaEmpleadoCajaIsNull();
}
