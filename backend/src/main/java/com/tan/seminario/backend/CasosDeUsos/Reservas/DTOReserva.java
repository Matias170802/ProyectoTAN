package com.tan.seminario.backend.CasosDeUsos.Reservas;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DTOReserva {
    private String codReserva;
    private LocalDateTime fechaHoraCheckin;
    private LocalDateTime fechaHoraCheckout;
    private LocalDateTime fechaHoraAltaReserva;
    private int totalDias;
    private int cantHuespedes;
    private double totalMonto;
    private double totalMontoSenia;
    private String plataformaOrigen;
    private String nombreHuesped;
    private String numeroTelefonoHuesped;
    private String emailHuesped;
    private String descripcionReserva;

    private String codInmueble;
    private String nombreInmueble;

    private String codEstadoReserva;
    private String nombreEstadoReserva;



}
