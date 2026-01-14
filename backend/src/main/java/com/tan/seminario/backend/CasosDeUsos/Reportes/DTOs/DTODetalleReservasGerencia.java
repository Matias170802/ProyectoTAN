package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTODetalleReservasGerencia {
    private String nombreInmueble;
    private String huesped;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Integer dias;
    private String estadoReserva;
    private BigDecimal montoTotalReserva;
}
