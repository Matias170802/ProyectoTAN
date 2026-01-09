package com.tan.seminario.backend.CasosDeUsos.Reservas.AMTarea;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoAMTarea {

    @Autowired
    private TareaRepository tareaRepository;
    @Autowired
    private EmpleadoRepository empleadoRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private TipoTareaRepository tipoTareaRepository;
    @Autowired
    private EstadoTareaRepository estadoTareaRepository;
    @Autowired
    private EstadoReservaRepository estadoReservaRepository;



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
            LocalDateTime fechaCheckIn = reservas.get(0).getFechaHoraInicioReserva();
            if (reservas.isEmpty()) {throw new RuntimeException("No se encuentra la Reserva con el Codigo: " + codReserva);}
            List<TipoTarea> tipoTareas = tipoTareaRepository.findByCodTipoTarea(codTipoTarea);
            if (tipoTareas.isEmpty()) {throw new RuntimeException("No se encuentra el Tipo de Tarea con el Codigo: " + codTipoTarea);}

            if (nombreTarea == null){
                nombreTarea = tipoTareas.get(0).getNombreTipoTarea();
            }

            EstadoTarea estadoTipoTarea = estadoTareaRepository.findByNombreEstadoTarea("Asignada");
            EstadoReserva estadoReserva = reservas.get(0).getEstadoReserva();
            // Creamos la Nueva Tarea
            try {
                Tarea tarea = new Tarea();
                tarea.setNombreTarea(nombreTarea);
                if (descripcionTarea != null) {
                    tarea.setDescripcionTarea(descripcionTarea);
                }
                tarea.setFechaHoraAsignacionTarea(LocalDateTime.now());
                tarea.setFechaHoraInicioTarea(fechaCheckIn);

                tarea.setEstadoTarea(estadoTipoTarea);
                tarea.setEmpleado(empleados.get(0));
                tarea.setReserva(reservas.get(0));
                tarea.setTipoTarea(tipoTareas.get(0));

                //Setear Estado Reserva
                if (estadoReserva.getNombreEstadoReserva().equals("Señada")) {
                    EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
                    Reserva reserva = reservas.get(0);
                    reserva.setEstadoReserva(estPreparada);
                }
                // Setear nro Tarea = al id
                //  Guardás
                Tarea guardada = tareaRepository.save(tarea);

                // Copiás el id a nroTarea
                guardada.setNroTarea(guardada.getId());

                // Guardás de nuevo
                tareaRepository.save(guardada);


                return "Tarea creada";
            }catch (Exception e){
                throw new RuntimeException("Fallo al crear la Tarea");
            }
        }else{
            //Modificacion
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

            EstadoTarea estadoTipoTarea = estadoTareaRepository.findByNombreEstadoTarea("Asignada");
            EstadoReserva estadoReserva = reservas.get(0).getEstadoReserva();

            try {
                if (nombreTarea == null) {
                    nombreTarea = tipoTareas.get(0).getNombreTipoTarea();
                }

                tareasModificacion.get(0).setNombreTarea(nombreTarea);
                tareasModificacion.get(0).setDescripcionTarea(descripcionTarea);
                tareasModificacion.get(0).setEmpleado(empleados.get(0));
                tareasModificacion.get(0).setReserva(reservas.get(0));
                tareasModificacion.get(0).setTipoTarea(tipoTareas.get(0));
                tareasModificacion.get(0).setFechaHoraAsignacionTarea(LocalDateTime.now());
                tareasModificacion.get(0).setEstadoTarea(estadoTipoTarea);
                tareasModificacion.get(0).setFechaHoraInicioTarea(reservas.get(0).getFechaHoraInicioReserva());

                //Setear Estado Reserva
                if (estadoReserva.getNombreEstadoReserva().equals("Señada")) {
                    EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
                    Reserva reserva = reservas.get(0);
                    reserva.setEstadoReserva(estPreparada);
                }

                tareaRepository.save(tareasModificacion.get(0));
                return "Tarea modificada";
            }catch (Exception e){
                throw new RuntimeException("Fallo al modificar la Tarea");
            }
        }
    }
}
