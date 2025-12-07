package com.tan.seminario.backend.CasosDeUsos.Reservas.AMTarea;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoAMTarea {

    private TareaRepository tareaRepository;
    private EmpleadoRepository empleadoRepository;
    private ReservaRepository reservaRepository;
    private TipoTareaRepository tipoTareaRepository;
    private EstadoTareaRepository estadoTareaRepository;



    public String altaModificacionTarea(DTOTarea dtoTarea){
        Long nroTarea = dtoTarea.getNroTarea();

        List<Tarea> tareasModificacion = tareaRepository.findByNroTarea(nroTarea);
        if (tareasModificacion.isEmpty()) {
            //Alta Tarea
            String nombreTarea = dtoTarea.getNombreTarea();
            String descripcionTarea = dtoTarea.getDescripcionTarea();

            String codEmpleado = dtoTarea.getCodEmpleado();
            String codReserva = dtoTarea.getCodReserva();
            String codTipoTarea = dtoTarea.getCodTipoTarea();

            //Busquedas
            List<Empleado> empleados = empleadoRepository.findByCodEmpleado(codEmpleado);
            if (empleados.isEmpty()) {throw new RuntimeException("No se encuentra el Empleado con el Codigo: " + codEmpleado);}
            List<Reserva> reservas = reservaRepository.findByCodReserva(codReserva);
            if (reservas.isEmpty()) {throw new RuntimeException("No se encuentra la Reserva con el Codigo: " + codReserva);}
            List<TipoTarea> tipoTareas = tipoTareaRepository.findByCodTipoTarea(codTipoTarea);
            if (tipoTareas.isEmpty()) {throw new RuntimeException("No se encuentra el Tipo de Tarea con el Codigo: " + codTipoTarea);}

            if (nombreTarea == null){
                nombreTarea = tipoTareas.get(0).getNombreTipoTarea();
            }

            List<EstadoTarea> estadoTipoTareas = estadoTareaRepository.findByNombreEstadoTarea("Asignada");
            // Creamos la Nueva Tarea
            Tarea tarea = new Tarea();
            tarea.setNombreTarea(nombreTarea);
            if (descripcionTarea == null){
                tarea.setDescripcionTarea(descripcionTarea);
            }
            tarea.setFechaHoraAsignacionTarea(LocalDateTime.now());

            tarea.setEstadoTarea(estadoTipoTareas.get(0));
            tarea.setEmpleado(empleados.get(0));
            tarea.setReserva(reservas.get(0));
            tarea.setTipoTarea(tipoTareas.get(0));
            tareaRepository.save(tarea);
            return "Tarea creada";
        }else{
            //Modificacion
        }


        return "Terminar";
    }
}
