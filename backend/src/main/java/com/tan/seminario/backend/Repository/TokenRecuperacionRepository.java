package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.TokenRecuperacion;
import com.tan.seminario.backend.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {

    /**
     * Busca un token específico que esté activo
     */
    Optional<TokenRecuperacion> findByTokenAndActivoTrue(String token);

    /**
     * Busca todos los tokens activos de un usuario
     */
    List<TokenRecuperacion> findByUsuarioAndActivoTrue(Usuario usuario);

    /**
     * Invalida todos los tokens activos de un usuario
     */
    @Query("UPDATE TokenRecuperacion t SET t.activo = false WHERE t.usuario = :usuario AND t.activo = true")
    void invalidarTokensActivos(@Param("usuario") Usuario usuario);

    /**
     * Elimina tokens expirados (limpieza automática)
     */
    void deleteByFechaExpiracionBefore(LocalDateTime fecha);

    /**
     * Cuenta cuántos tokens activos tiene un usuario en las últimas N horas
     * (Para prevenir spam de solicitudes de recuperación)
     */
    @Query("SELECT COUNT(t) FROM TokenRecuperacion t WHERE t.usuario = :usuario " +
            "AND t.activo = true AND t.fechaCreacion > :desde")
    long contarTokensRecientes(@Param("usuario") Usuario usuario, @Param("desde") LocalDateTime desde);
}