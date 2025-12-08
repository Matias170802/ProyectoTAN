package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.Listados;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DTOInmuebleListado {
    private Long id;
    private String codInmueble;
    private String nombreInmueble;
    private Integer cantidadBaños;
    private Integer cantidadDormitorios;
    private Integer capacidad;
    private String direccion;
    private Double m2Inmueble;
    private Double precioPorNocheUSD;
    private LocalDateTime fechaHoraAltaInmueble;
    private String codCliente;
    private String nombreCliente;
    private boolean activo;
}