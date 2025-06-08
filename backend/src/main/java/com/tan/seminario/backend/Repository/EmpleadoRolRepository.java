package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.EmpleadoRol;

import java.util.List;


public interface EmpleadoRolRepository extends BaseRepository<EmpleadoRol, Long> {
    List<EmpleadoRol> findByFechaHoraBajaEmpleadoRolNull  (String codEmpleado);
}
