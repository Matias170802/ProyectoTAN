package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findAllValidIsFalseOrRevokedIsFalseByUsuario_IdUsuario(Long usuarioIdUsuario);

    Optional<Token> findByToken(String jwtToken);
}