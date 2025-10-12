package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Empleado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmpleadoRepository  extends JpaRepository<Empleado, Long> {
    @Override
    Optional<Empleado> findById(Long aLong);
    Optional<Empleado> findTopByOrderByCodEmpleadoDesc();

    List<Empleado> findByCodEmpleado(String codEmpleado);
    List<Empleado> findByFechaHoraBajaEmpleadoIsNull();

    boolean existsByDniEmpleadoAndFechaHoraBajaEmpleadoIsNull(String dniEmpleado);
}
