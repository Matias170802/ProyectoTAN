package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOEstadisticasReservasFinancieras {
    private String inmueble;
    private String huesped;
    private Date checkin;
    private Integer dias;
    private BigDecimal total;
    private BigDecimal gananciaCliente;
    private BigDecimal gananciaEmpresa;
}
