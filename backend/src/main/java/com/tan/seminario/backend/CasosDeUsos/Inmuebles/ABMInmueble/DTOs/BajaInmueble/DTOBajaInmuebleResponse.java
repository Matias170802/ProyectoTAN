package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.BajaInmueble;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class DTOBajaInmuebleResponse {
    private String mensaje;
    private boolean exito;
    private DatosInmuebleDadoDeBaja inmueble;

    @Builder
    @Getter
    @Setter
    public static class DatosInmuebleDadoDeBaja {
        private Long id;
        private String codInmueble;
        private String nombreInmueble;
        private String direccion;
        private LocalDateTime fechaHoraBaja;
        private String codCliente;
        private String nombreCliente;
    }
}