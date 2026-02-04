package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class DTOModificarClienteResponse {
    private String mensaje;
    private boolean exito;
    private String codCliente;
    private String nombreCliente;
    private String dniCliente;
}