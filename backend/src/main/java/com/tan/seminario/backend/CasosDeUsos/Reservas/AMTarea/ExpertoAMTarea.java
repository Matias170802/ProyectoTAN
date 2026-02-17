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
        //busco la reserva para analizar si ya posee tareas
        String codReserva = dtoTarea.getCodReserva();
        Reserva reservaEncontrada = reservaRepository.findByCodReserva(codReserva).get(0);

        //busco las tareas relacionadas a la reserva
        List<Tarea> tareasExistentes = tareaRepository.findByReserva(reservaEncontrada);

        if (tareasExistentes.isEmpty()) {
            //Alta Tarea
            String nombreTarea = dtoTarea.getNombreTarea();
            String descripcionTarea = dtoTarea.getDescripcionTarea();

            String codEmpleado = dtoTarea.getCodEmpleado();
            String codTipoTarea = dtoTarea.getCodTipoTarea();

            //Busquedas
            List<Empleado> empleados = empleadoRepository.findByCodEmpleado(codEmpleado);
            if (empleados.isEmpty()) {throw new RuntimeException("No se encuentra el Empleado con el Codigo: " + codEmpleado);}
            List<Reserva> reservas = reservaRepository.findByCodReserva(codReserva);

            if (reservas.isEmpty()) {throw new RuntimeException("No se encuentra la Reserva con el Codigo: " + codReserva);}
            List<TipoTarea> tipoTareas = tipoTareaRepository.findByCodTipoTarea(codTipoTarea);
            if (tipoTareas.isEmpty()) {throw new RuntimeException("No se encuentra el Tipo de Tarea con el Codigo: " + codTipoTarea);}

            //asigno la fecha de inicio de la tarea dependiendo si es de tipo checkin o check out
            LocalDateTime fechaInicioTarea;

            if (tipoTareas.get(0).getNombreTipoTarea().equals("Check-In")){
                 fechaInicioTarea = reservas.get(0).getFechaHoraInicioReserva();
            } else {
                fechaInicioTarea = reservas.get(0).getFechaHoraFinReserva();
            }


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
                tarea.setFechaHoraInicioTarea(fechaInicioTarea);

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

            //analizo si la tarea a modificar es de tipo check in o out para saber cual modificar

            if (dtoTarea.getCodTipoTarea().equals("TI001")){
                //es de tipo check-in

                Tarea tareaCheckIn = null;

                //busco la tarea de tipo checkin existente para modificarla
                for (Tarea tarea : tareasExistentes) {
                    if (tarea.getTipoTarea().getCodTipoTarea().equals("TI001")){
                        tareaCheckIn = tarea;
                    }
                }

                try {
                    if (nombreTarea == null) {
                        nombreTarea = tipoTareas.get(0).getNombreTipoTarea();
                    }

                    tareaCheckIn.setNombreTarea(nombreTarea);
                    tareaCheckIn.setDescripcionTarea(descripcionTarea);
                    tareaCheckIn.setEmpleado(empleados.get(0));
                    tareaCheckIn.setReserva(reservas.get(0));
                    tareaCheckIn.setTipoTarea(tipoTareas.get(0));
                    tareaCheckIn.setFechaHoraAsignacionTarea(LocalDateTime.now());
                    tareaCheckIn.setEstadoTarea(estadoTipoTarea);
                    tareaCheckIn.setFechaHoraInicioTarea(reservas.get(0).getFechaHoraInicioReserva());

                    //Setear Estado Reserva
                    if (estadoReserva.getNombreEstadoReserva().equals("Señada")) {
                        EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
                        Reserva reserva = reservas.get(0);
                        reserva.setEstadoReserva(estPreparada);
                    }

                    tareaRepository.save(tareaCheckIn);
                    return "Tarea modificada";
                }catch (Exception e){
                    throw new RuntimeException("Fallo al modificar la Tarea");
                }
            }
            else {
                //la tarea es de tipo check.out

                Tarea tareaCheckOut = null;

                //busco la tarea de tipo checkin existente para modificarla
                for (Tarea tarea : tareasExistentes) {
                    if (tarea.getTipoTarea().getCodTipoTarea().equals("TI002")){
                        tareaCheckOut = tarea;
                    }
                }
                try {
                    if (nombreTarea == null) {
                        nombreTarea = tipoTareas.get(0).getNombreTipoTarea();
                    }

                    tareaCheckOut.setNombreTarea(nombreTarea);
                    tareaCheckOut.setDescripcionTarea(descripcionTarea);
                    tareaCheckOut.setEmpleado(empleados.get(0));
                    tareaCheckOut.setReserva(reservas.get(0));
                    tareaCheckOut.setTipoTarea(tipoTareas.get(0));
                    tareaCheckOut.setFechaHoraAsignacionTarea(LocalDateTime.now());
                    tareaCheckOut.setEstadoTarea(estadoTipoTarea);
                    tareaCheckOut.setFechaHoraInicioTarea(reservas.get(0).getFechaHoraInicioReserva());

                    //Setear Estado Reserva
                    if (estadoReserva.getNombreEstadoReserva().equals("Señada")) {
                        EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
                        Reserva reserva = reservas.get(0);
                        reserva.setEstadoReserva(estPreparada);
                    }

                    tareaRepository.save(tareaCheckOut);
                    return "Tarea modificada";
                }catch (Exception e){
                    throw new RuntimeException("Fallo al modificar la Tarea");
                }
            }
        }
    }
}
