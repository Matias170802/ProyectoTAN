package com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DTOLoginRequest {
    private String username;
    private String password;
}