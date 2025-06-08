package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Empleado;

import java.util.List;

public interface EmpleadoRepository extends BaseRepository<Empleado, Long> {
    List<Empleado> findByCodEmpleado(String codEmpleado);
}