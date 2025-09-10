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
    private Integer totalDias;
    private Double totalMonto;
    private Double totalMontoCheckIn;
    private Double totalMontoSenia;

    @ManyToOne
    @JoinColumn(name = "idInmueble", nullable = false)
    private Inmueble inmueble;

    @ManyToOne
    @JoinColumn(name = "idEstadoReserva", nullable = false)
    private EstadoReserva estadoReserva;

}
