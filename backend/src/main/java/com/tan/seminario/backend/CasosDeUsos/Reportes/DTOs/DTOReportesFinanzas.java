package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOReportesFinanzas {

    private BigDecimal gananciasCliente;
    private BigDecimal gananciasEmpresa;
    private BigDecimal gananciasTotales;
    private List<DTOEstadisticasPorInmuebleFinancieras> estadisticasPorInmueble = new ArrayList<DTOEstadisticasPorInmuebleFinancieras>();
    private List<DTOEstadisticasReservasFinancieras> estadisticasReservas = new java.util.ArrayList<DTOEstadisticasReservasFinancieras>();
}
