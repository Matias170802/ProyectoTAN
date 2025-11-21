package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AltaEmpleadoResponse {
    private String nombreEmpleado;
    private TokenResponse tokenResponse;
    private String mensaje;
    private String email;
    private String password;
}
