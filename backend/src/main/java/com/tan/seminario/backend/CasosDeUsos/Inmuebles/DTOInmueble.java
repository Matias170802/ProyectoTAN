package com.tan.seminario.backend.CasosDeUsos.Inmuebles;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DTOInmueble {
    private String codInmueble;
    private String nombreInmueble;
    private Integer capacidad;
    private Double precioPorNocheUSD;
}
