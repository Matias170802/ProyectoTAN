package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad para almacenar tokens de recuperación de contraseña
 * Los tokens expiran después de 1 hora
 */
@Entity
@Table(name = "TokenRecuperacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenRecuperacion extends Base {

    @Column(unique = true, nullable = false)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaUso; // Cuando se usó el token

    @Column(nullable = false)
    private Boolean usado = false;

    @Column(nullable = false)
    private Boolean activo = true;

    /**
     * Verifica si el token ha expirado
     */
    public boolean isExpirado() {
        return LocalDateTime.now().isAfter(fechaExpiracion);
    }

    /**
     * Verifica si el token es válido (no usado, no expirado, activo)
     */
    public boolean isValido() {
        return activo && !usado && !isExpirado();
    }
}