package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "Usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Base {

    @NotNull
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NotNull
    @Column(name = "password", nullable = false)
    private String password; // Encriptada

    @NotNull
    @Column(nullable = false)
    private LocalDateTime fechaHoraAltaUsuario;

    @Column
    private LocalDateTime fechaHoraBajaUsuario;

    @OneToOne
    private Empleado empleado;

    @OneToOne
    private Cliente cliente;

    // Validar que tenga Empleado o Cliente, pero NO AMBOS AL MISMO TIEMPO
    @PrePersist
    @PreUpdate
    private void validarRelacionExclusiva() {
        if ((empleado == null && cliente == null) || (empleado != null && cliente != null)) {
            throw new IllegalStateException("El usuario debe tener un empleado o un cliente, pero no ambos.");
        }
    }
}
