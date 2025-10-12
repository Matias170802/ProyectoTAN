package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByCodRolAndFechaHoraBajaRolIsNull(String codRol);

    List<Rol> findByCodRol(String codRol);
    List<Rol> findByNombreRol(String nombre);
    List<Rol> findByFechaHoraBajaRolIsNull();

}

