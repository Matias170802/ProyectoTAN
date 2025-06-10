package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends BaseRepository<Rol, Long>{
    // Verificar si el Rol existe
    List<Rol> findByNombreRol(String nombreRol);

    // Para listar solo roles activos
    List<Rol> findByFechaHoraBajaRolIsNull();

    // Buscar por codRol
    Optional<Rol> findByCodRol(String codRol);


    // CONSULTAS PERSONALIZADAS
    // Buscar por nombre ignorando mayusculas y minusculas
    @Query("SELECT r FROM Rol r WHERE LOWER(r.nombreRol) = LOWER(:nombre)")
    List<Rol> findByNombreRolIgnoreCase(@Param("nombre") String nombre);

    // Buscar por NombreRol y ACTIVO
    @Query("SELECT r FROM Rol r WHERE LOWER(r.nombreRol) = LOWER(:nombreRol) AND r.fechaHoraBajaRol IS NULL")
    Optional<Rol> findByNombreRolIgnoreCaseAndActivo(@Param("nombreRol") String nombreRol);

}

