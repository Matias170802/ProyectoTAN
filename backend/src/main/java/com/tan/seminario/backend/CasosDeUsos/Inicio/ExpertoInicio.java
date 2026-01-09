package com.tan.seminario.backend.CasosDeUsos.Inicio;

import com.tan.seminario.backend.CasosDeUsos.Inicio.DTOInicio.DTOTarea;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EstadoTarea;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.EstadoTareaRepository;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpertoInicio {

    private final InmuebleRepository inmuebleRepository;
    private final TareaRepository tareaRepository;
    private final EstadoTareaRepository estadoTareaRepository;
    private final UsuarioRepository usuarioRepository;

    public ExpertoInicio(InmuebleRepository inmuebleRepository, TareaRepository tareaRepository, EstadoTareaRepository estadoTareaRepository, UsuarioRepository usuarioRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.tareaRepository = tareaRepository;
        this.estadoTareaRepository = estadoTareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<DTOTarea> buscarTareas(String username) {

        Usuario usuario = usuarioRepository.findByEmail(username).get();

        Empleado empleadoActual = usuario.getEmpleado();

        //busco el estado que deben tener las tareas a buscar
        EstadoTarea estadoTareaABuscar = estadoTareaRepository.findByNombreEstadoTarea("Asignada");

        //busco las tareas relacionadas al estado Asignada
        List<Tarea> tareasEncontradasARealizar = tareaRepository.findTareaByEstadoTareaAndEmpleado(estadoTareaABuscar, empleadoActual);

        List<DTOTarea> dtos = new java.util.ArrayList<>();

        for (Tarea tarea: tareasEncontradasARealizar) {
            DTOTarea dto = DTOTarea.builder()
                    .descripcionTarea(tarea.getDescripcionTarea())
                    .fechaYHoraTarea(tarea.getFechaHoraInicioTarea())
                    .nombreTarea(tarea.getNombreTarea())
                    .ubicacionTarea(tarea.getReserva().getInmueble().getDireccion())
                    .tipoTarea(tarea.getTipoTarea().getNombreTipoTarea())
                    .nroTarea(tarea.getNroTarea())
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }
}
