package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOReporteInmuebleCliente {
    private LocalDateTime fechaMovimiento;
    private Double montoMovimiento;
    private String monedaMovimiento;
    private String descripcionMovimiento;
    private String nombreCategoriaMovimiento;

    private LocalDateTime fechaInicioReserva;
    private LocalDateTime fechaFinReserva;
    private String 
}
