package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterRequest {
    String email;
    String password;
    String cod;

    // Discriminador
    private TipoUsuario tipoUsuario;// EMPLEADO o CLIENTE

    public enum TipoUsuario {
        EMPLEADO,
        CLIENTE
    }
}