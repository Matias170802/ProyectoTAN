package com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    String email;
    String password;
}
