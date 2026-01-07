package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOInmueblesFiltro {
    private String codInmueble;
    private String nombreInmueble;
}
