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

    @ManyToOne
    @JoinColumn(name = "idTipoTarea", nullable = false)
    private TipoTarea tipoTarea;

    @ManyToOne
    @JoinColumn(name = "idEstadoTarea", nullable = false)
    private EstadoTarea estadoTarea;

    @ManyToOne
    @JoinColumn(name = "idEmpleado", nullable = false)
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "idReserva", nullable = false)
    private Reserva reserva;
}
