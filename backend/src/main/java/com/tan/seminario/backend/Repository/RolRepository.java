package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends BaseRepository<Rol, Long>{
    // Verificar si el Rol existe
    List<Rol> findByNombreRol(String nombreRol);

    // Para listar solo roles activos
    List<Rol> findByFechaHoraBajaRolIsNull();


    // CONSULTAS PERSONALIZADAS

    // Buscar por nombre ignorando mayusculas y minusculas
    @Query("SELECT r FROM Rol r WHERE LOWER(r.nombreRol) = LOWER(:nombre)")
    List<Rol> findByNombreRolIgnoreCase(@Param("nombre") String nombre);


    // Buscar por codRol
    // Optional<Rol> findByCodRol(String codRol);

    // Buscar por nombreRol y codRol
    // List<Rol> findByNombreRolAndCodRol(String nombreRol, String codRol);

    // Buscar por nombreRol y codRol y fechaHoraBajaRolIsNull
    // List<Rol> findByNombreRolAndCodRolAndFechaHoraBajaRolIsNull(String nombreRol, String codRol);

}

