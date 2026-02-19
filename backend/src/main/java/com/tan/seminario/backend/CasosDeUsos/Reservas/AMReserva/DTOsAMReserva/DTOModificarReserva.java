package com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva.DTOsAMReserva;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DTOModificarReserva {
    private LocalDateTime fechaHoraInicioReserva;
    private LocalDateTime fechaHoraFinReserva;
    private Integer totalDias;
    private Integer cantidadHuespedes;
    private String nombreHuesped;
    private String numeroTelefonoHuesped;
    private String emailHuesped;
    private String plataformaOrigen;//Airbnb Booking etc
    private String descripcionReserva;
}
