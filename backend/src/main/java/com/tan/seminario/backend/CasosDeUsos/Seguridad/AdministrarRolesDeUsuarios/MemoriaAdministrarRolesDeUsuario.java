package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MemoriaAdministrarRolesDeUsuario {

    private Empleado empleado;
    private List<Rol> rolesDelEmpleado;

    public void agregarRol(Rol rol) {
        if (this.rolesDelEmpleado == null) {
            this.rolesDelEmpleado = new ArrayList<>();
        }
        this.rolesDelEmpleado.add(rol);
    }
}