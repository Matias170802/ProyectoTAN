package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpleadoRolRepositorioParaBorrarEnMain extends JpaRepository<EmpleadoRol, Long> {

    @Query("SELECT er FROM EmpleadoRol er WHERE er.empleado = :empleado AND er.fechaHoraBajaEmpleadoRol IS NULL")
    List<EmpleadoRol> findRolesVigentesByEmpleado(@Param("empleado") Empleado empleado);
}
