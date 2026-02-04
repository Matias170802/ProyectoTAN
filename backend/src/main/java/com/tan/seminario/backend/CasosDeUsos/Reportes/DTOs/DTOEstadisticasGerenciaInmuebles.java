package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOEstadisticasGerenciaInmuebles {
    private Integer cantidadReservasInmueble;
    private Integer totalDiasOcupadosInmueble;
    private Integer totalDiasLibresInmueble;
    private Double tasaOcupacionInmueble;
    private BigDecimal ingresosGeneradosInmueble;
    private String nombreInmueble;
    private List<DTODetalleReservasGerencia> detalleReservas;
}
