package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "EstadoReserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class EstadoReserva  extends Base {

    @Column (unique = true)
    private String codEstadoReserva;

    @Column (unique = true)
    private String nombreEstadoReserva;

    private LocalDateTime fechaHoraBajaEstadoReserva;
    private LocalDateTime fechaHoraAltaEstadoReserva;
}
