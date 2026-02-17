package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EstadoTarea;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository <Tarea, Long>{

    List<Tarea> findTareaByEstadoTarea(EstadoTarea estadoTarea);
    Tarea findTareaByNombreTarea(String nombreTarea);
    List<Tarea> findByNroTarea(Long nroTarea);
    List<Tarea> findTareaByEstadoTareaAndEmpleado(EstadoTarea estadoTarea, Empleado empleado);
    Tarea findTareaByNroTarea(Long nroTarea);
    List<Tarea> findByReserva(Reserva reserva);

    Reserva reserva(Reserva reserva);
}
