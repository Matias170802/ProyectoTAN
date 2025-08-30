package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/*Lombok*/
@Entity
@Table(name = "Usuario")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Usuario extends Base {

    private String username;
    private String password; // Encriptada
    private String jwt; // token JWT actual

    @OneToOne
    @JoinColumn(name = "idEmpleado")
    private Empleado empleado;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private List<Rol> roles;
}
