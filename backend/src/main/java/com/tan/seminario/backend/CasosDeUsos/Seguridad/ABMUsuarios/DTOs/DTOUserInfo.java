package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DTOUserInfo {
    private String email;
    private String nombre;
    private String codigo;
    private TipoUsuario tipoUsuario;
    private List<String> roles;
    private boolean esEmpleado;
    private boolean esCliente;

    public enum TipoUsuario {
        EMPLEADO,
        CLIENTE
    }
}