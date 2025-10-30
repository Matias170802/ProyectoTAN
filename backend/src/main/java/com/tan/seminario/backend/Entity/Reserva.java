package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Reserva  extends Base {

    @Column(unique = true)
    private String codReserva;

    private LocalDateTime fechaHoraInicioReserva;
    private LocalDateTime fechaHoraFinReserva;
    private LocalDateTime fechaHoraAltaReserva;
    private Integer totalDias;
    private Integer cantidadHuespedes;
    private String nombreHuesped;
    private String numeroTelefonoHuesped;
    private String emailHuesped;
    private Double totalMonto;
    private Double totalMontoCheckIn;
    private Double totalMontoSenia;
    private String plataformaOrigen;//Airbnb Booking etc
    private String descripcionReserva;

    @ManyToOne
    @JoinColumn(name = "idInmueble", nullable = false)
    private Inmueble inmueble;

    @ManyToOne
    @JoinColumn(name = "idEstadoReserva", nullable = false)
    private EstadoReserva estadoReserva;

}
