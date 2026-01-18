package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOMovimiento;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.ExpertoRegistrarIngresoEgresoCaja;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareaFinalizadaARegistrar;
import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.EstadoTareaRepository;
import com.tan.seminario.backend.Repository.MovimientoRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class ExpertoFinalizarTarea {

    private final TareaRepository tareaRepository;
    private final EstadoTareaRepository estadoTareaRepository;
    private final ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja;
    private final MovimientoRepository movimientoRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final Logger logger = Logger.getLogger(ExpertoFinalizarTarea.class.getName());

    public ExpertoFinalizarTarea(TareaRepository tareaRepository, EstadoTareaRepository estadoTareaRepository, ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja, MovimientoRepository movimientoRepository, EstadoReservaRepository estadoReservaRepository) {
        this.tareaRepository = tareaRepository;
        this.estadoTareaRepository = estadoTareaRepository;
        this.expertoRegistrarIngresoEgresoCaja = expertoRegistrarIngresoEgresoCaja;
        this.movimientoRepository = movimientoRepository;
        this.estadoReservaRepository = estadoReservaRepository;
    }

    public void finalizarTarea(DTOTareaFinalizadaARegistrar tareaFinalizadaARegistrar, String username) {

        logger.info("tarea a finalizar " + tareaFinalizadaARegistrar.getNroTarea());

        Tarea tareaAFinalizar = tareaRepository.findTareaByNroTarea(tareaFinalizadaARegistrar.getNroTarea());

        if (tareaAFinalizar == null) {
            throw new RuntimeException("No se encuentra la Tarea con el Nro de Tarea: " + tareaFinalizadaARegistrar.getNroTarea());
        }

        if (tareaAFinalizar.getTipoTarea().getNombreTipoTarea().equals("Check-Out")) {

            //busco la reserva relacionada a la tarea
            Reserva reservaAFinalizar = tareaAFinalizar.getReserva();

            if (reservaAFinalizar.getEstadoReserva().getNombreEstadoReserva().equals("En Curso")) {
                //busco el estado que le tengo que asignar a la reserva
                EstadoReserva estadoReservaFinalizada = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");

                //asigno el estado a la reserva
                reservaAFinalizar.setEstadoReserva(estadoReservaFinalizada);
            } else {
                throw new RuntimeException("La Reserva no se puede Finalizar porque no esta en Curso");
            }

        } else {
            //SI ES DE TIPO CHECK-IN
            //busco la reserva relacionada a la tarea
            Reserva reservaAFinalizar = tareaAFinalizar.getReserva();

            if (reservaAFinalizar.getEstadoReserva().getNombreEstadoReserva().equals("Preparada")) {
                //busco el estado que le tengo que asignar a la reserva
                EstadoReserva estadoReservaFinalizada = estadoReservaRepository.findByNombreEstadoReserva("En Curso");

                //asigno el estado a la reserva
                reservaAFinalizar.setEstadoReserva(estadoReservaFinalizada);
            } else {
                throw new RuntimeException("La Reserva no se puede Finalizar porque no esta Preparada");
            }
        }

        //seteo el estado finalizada a la tarea
        tareaAFinalizar.setEstadoTarea(estadoTareaRepository.findByNombreEstadoTarea("Finalizada"));
        //asigno la fecha en que finaliza
        tareaAFinalizar.setFechaHoraFinTarea(LocalDateTime.now());

        //registro los movimientos relacionados a la reserva y a la tarea
        for (DTOTransaccionARegistrar movimiento: tareaFinalizadaARegistrar.getMovimientosARegistrar()) {
            DTOMovimiento DTOMovimientoRegistrado = expertoRegistrarIngresoEgresoCaja.registrarMovimiento(movimiento, username);

            //busco el movimiento
            Movimiento movimientoRegistrado = movimientoRepository.findByNroMovimiento(DTOMovimientoRegistrado.getNroMovimiento());

            movimientoRegistrado.setTarea(tareaAFinalizar);
            movimientoRegistrado.setReserva(tareaAFinalizar.getReserva());

            movimientoRepository.save(movimientoRegistrado);
        }

        tareaRepository.save(tareaAFinalizar);

    }
}
