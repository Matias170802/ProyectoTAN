package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface RolRepository extends BaseRepository<Rol, Long>{
    // Verificar si el Rol existe
    List<Rol> findByNombre(String nombre);
}

