package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
}
