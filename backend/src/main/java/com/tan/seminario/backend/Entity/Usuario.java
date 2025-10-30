package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Entity
@Table(name = "Usuario")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Usuario extends Base {

    private String name;
    private String password; // Encriptada - hashed

    @Column(name = "email", unique = true)
    private String email;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<Token> tokens;

    @OneToOne
    @JoinColumn(name = "idEmpleado")
    private Empleado empleado;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @PrePersist
    @PreUpdate
    private void validarMutuaExclusividad() {
        if (empleado != null && cliente != null) {
            throw new IllegalStateException("No puede tener asignado un Empleado y un Cliente al mismo tiempo");
        }
        if (empleado == null && cliente == null) {
            throw new IllegalStateException("Debe asignarse al menos un Empleado o un Cliente");
        }
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private List<Rol> roles;
}
