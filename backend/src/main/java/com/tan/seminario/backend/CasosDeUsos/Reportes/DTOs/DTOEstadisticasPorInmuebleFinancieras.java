package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOEstadisticasPorInmuebleFinancieras {
    private String nombreInmueble;
    private BigDecimal gananciasCliente;
    private BigDecimal gananciasEmpresa;
}

