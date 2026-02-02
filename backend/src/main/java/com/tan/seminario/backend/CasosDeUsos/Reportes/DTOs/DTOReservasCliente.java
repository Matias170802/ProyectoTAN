package com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOReservasCliente {
    private LocalDateTime fechaInicioReserva;
    private LocalDateTime fechaFinReserva;
    private String estadoReserva;
    private String nombreHuesped;
    private Double montoTotalReserva;
}
