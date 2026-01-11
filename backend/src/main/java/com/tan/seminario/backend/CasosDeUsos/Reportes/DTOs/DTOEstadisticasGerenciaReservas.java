package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOEstadisticasGerenciaReservas {
    private Integer cantTotalReservas;
    private Integer diasTotalesReservados;
    private BigDecimal montoTotalGanado;
    private BigDecimal montoPromedioPorReserva;
    private List<DTOIncidenciaInmuebles> incidenciaInmuebles;
    private List<DTODetalleReservasGerencia> detalleReservas;
}
