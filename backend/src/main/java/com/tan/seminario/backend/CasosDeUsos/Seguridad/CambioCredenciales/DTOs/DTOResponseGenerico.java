package com.tan.seminario.backend.CasosDeUsos.Seguridad.CambioCredenciales.DTOs;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DTOResponseGenerico {
    private String mensaje;
    private boolean exito;

    // Tokens nuevos generados automáticamente (solo cuando se cambian credenciales con sesión activa)
    private TokenResponse tokens;
}