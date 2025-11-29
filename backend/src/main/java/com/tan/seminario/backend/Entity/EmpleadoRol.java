package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "EmpleadoRol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*Lombok*/

public class EmpleadoRol  extends Base{

    private LocalDateTime fechaHoraAltaEmpleadoRol;
    private LocalDateTime fechaHoraBajaEmpleadoRol;

    @ManyToOne
    @JoinColumn(name = "idEmpleado", nullable = false)
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "idRol", nullable = false)
    private Rol rol;
}
