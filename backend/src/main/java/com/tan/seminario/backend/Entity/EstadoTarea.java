package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "EstadoTarea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class EstadoTarea  extends Base {

    @Column (unique = true)
    private String codEstadoTarea;

    @Column (unique = true)
    private String nombreEstadoTarea;

    private LocalDateTime fechaHoraBajaEstadoTarea;
    private LocalDateTime fechaHoraAltaEstadoTarea;
}
