package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.ExpertoRegistrarIngresoEgresoCaja;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareaFinalizadaARegistrar;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Repository.EstadoTareaRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.springframework.stereotype.Service;

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

    public Tarea finalizarTarea(DTOTareaFinalizadaARegistrar tareaFinalizadaARegistrar, String username) {

        Tarea tareaAFinalizar = tareaRepository.findTareaByNroTarea(tareaFinalizadaARegistrar.getNroTarea());

        tareaAFinalizar.setEstadoTarea(estadoTareaRepository.findByNombreEstadoTarea("Finalizada"));

        for (DTOTransaccionARegistrar movimiento: tareaFinalizadaARegistrar.getMovimientosARegistrar()) {
            Movimiento movimientoRegistrado = expertoRegistrarIngresoEgresoCaja.registrarMovimiento(movimiento, username);

            movimientoRegistrado.setTarea(tareaAFinalizar);
        }

        return tareaAFinalizar;
    }
}
