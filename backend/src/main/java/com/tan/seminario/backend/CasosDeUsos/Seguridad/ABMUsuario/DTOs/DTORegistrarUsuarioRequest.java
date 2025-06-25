package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DTORegistrarUsuarioRequest {
    private String username;
    private String password;
}