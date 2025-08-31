package com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    String email;
    String password;
    String name;
}