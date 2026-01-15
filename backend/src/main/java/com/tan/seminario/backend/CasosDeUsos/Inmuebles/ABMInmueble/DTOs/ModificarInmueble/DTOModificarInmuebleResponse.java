package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class DTOModificarInmuebleResponse {
    private String mensaje;
    private boolean exito;
    private DatosInmuebleModificado inmueble;

    @Builder
    @Getter
    @Setter
    public static class DatosInmuebleModificado {
        private Long id;
        private String codInmueble;
        private String nombreInmueble;
        private Integer cantidadBaños;
        private Integer cantidadDormitorios;
        private Integer capacidad;
        private Double m2Inmueble;
        private Double precioPorNocheUSD;
        private LocalDateTime fechaModificacion;
    }
}