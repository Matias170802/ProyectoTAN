package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOIncidenciaInmuebles {
    private String codInmueble;
    private String nombreInmueble;
    private Integer porcentajeIncidencia;
}
