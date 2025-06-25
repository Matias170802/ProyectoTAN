package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMCliente.DTOs;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DTOAltaClienteRequest {
    // DATOS RECIBIDOS DEL FRONTEND para Crear un Cliente
    private String nombreCliente;
    private String dniCliente;
    private String codCliente;
}
