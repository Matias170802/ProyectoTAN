package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Tarea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Tarea  extends Base {

    private Long nroTarea;

    private String nombreTarea;
    private String descripcionTarea;
    private LocalDateTime fechaHoraAsignacionTarea;
    private LocalDateTime fechaHoraInicioTarea;
    private LocalDateTime fechaHoraFinTarea;
}
