package com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    private String username;
    private String password;
}