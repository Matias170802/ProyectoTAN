package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.CambioCredenciales.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DTORecuperarEmailResponse {
    private String mensaje;
    private String emailEncontrado; // Parcialmente oculto por seguridad
    private boolean exito;
}
