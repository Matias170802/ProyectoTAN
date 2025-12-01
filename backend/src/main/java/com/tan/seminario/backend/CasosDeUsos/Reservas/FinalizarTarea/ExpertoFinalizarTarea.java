package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.ExpertoRegistrarIngresoEgresoCaja;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareaFinalizadaARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareasARealizar;
import com.tan.seminario.backend.Entity.EstadoTarea;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Repository.EstadoTareaRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpertoFinalizarTarea {

    private final TareaRepository tareaRepository;
    private final EstadoTareaRepository estadoTareaRepository;
    private final ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja;

    public ExpertoFinalizarTarea(TareaRepository tareaRepository, EstadoTareaRepository estadoTareaRepository, ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja) {
        this.tareaRepository = tareaRepository;
        this.estadoTareaRepository = estadoTareaRepository;
        this.expertoRegistrarIngresoEgresoCaja = expertoRegistrarIngresoEgresoCaja;
    }

    public List<DTOTareasARealizar> buscarTareasARealizar () {

        //TODO: BUSCAR TAREAS RELACIONADAS A UN EMPLEADO Y DSP FILTRARLAS POR ESTADO

        //busco el estado que deben tener las tareas a buscar
        EstadoTarea estadoTareaABuscar = estadoTareaRepository.findByNombreEstadoTarea("Asignada");

        //busco las tareas relacionadas al estado Asignada
        List<Tarea> tareasEncontradasARealizar = tareaRepository.findTareaByEstadoTarea(estadoTareaABuscar);

        List<DTOTareasARealizar> dtos = new java.util.ArrayList<>();

        for (Tarea tarea: tareasEncontradasARealizar) {
            DTOTareasARealizar dto = DTOTareasARealizar.builder()
                    .descripcionTarea(tarea.getDescripcionTarea())
                    .fechayHoraTarea(tarea.getFechaHoraInicioTarea())
                    .nombreTarea(tarea.getNombreTarea())
                    .ubicacionTarea(tarea.getReserva().getInmueble().getDireccion())
                    .tipoTarea(tarea.getTipoTarea().getNombreTipoTarea())
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }

    public Tarea finalizarTarea(DTOTareaFinalizadaARegistrar tareaFinalizadaARegistrar) {

        Tarea tareaAFinalizar = tareaRepository.findTareaByNombreTarea(tareaFinalizadaARegistrar.getNombreTarea());

        tareaAFinalizar.setEstadoTarea(estadoTareaRepository.findByNombreEstadoTarea("Finalizada"));

        for (DTOTransaccionARegistrar movimiento: tareaFinalizadaARegistrar.getMovimientosARegistrar()) {
            Movimiento movimientoRegistrado = expertoRegistrarIngresoEgresoCaja.registrarMovimiento(movimiento);

            movimientoRegistrado.setTarea(tareaAFinalizar);
        }

        return tareaAFinalizar;
    }
}
