package com.tan.seminario.backend.CasosDeUsos.Reservas.CancelarReserva;

import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.EstadoTarea;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.EstadoTareaRepository;
import com.tan.seminario.backend.Repository.ReservaRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;


@Service
public class ExpertoCancelarReserva {
    private static final Logger log = LoggerFactory.getLogger(ExpertoCancelarReserva.class);

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private EstadoTareaRepository estadoTareaRepository;

    public String cancelarReserva(String codReserva){
        List<Reserva> reservas = reservaRepository.findByCodReserva(codReserva);
        if (reservas.isEmpty()) {
            throw new RuntimeException("No se encuentra la Reserva con el Codigo: " + codReserva);
        }
        List<Tarea> tareas = tareaRepository.findByReserva(reservas.get(0));

        EstadoReserva estadoReserva = reservas.get(0).getEstadoReserva();
        String nombreEstadoReserva = estadoReserva.getNombreEstadoReserva();

        if (nombreEstadoReserva.equals("Señada") || nombreEstadoReserva.equals("Preparada")){
            EstadoReserva estadoReservaCancelada = estadoReservaRepository.findByCodEstadoReserva("EST002");
            if (estadoReservaCancelada == null) {
                throw new RuntimeException("No se encuentra el Estado de Reserva Cancelada");
            }
            reservas.get(0).setEstadoReserva(estadoReservaCancelada);
            if (tareas.isEmpty()) {
                //NO hay tareas no hacemos nada
            }else{
                EstadoTarea estadoTareaAnulada = estadoTareaRepository.findByCodEstadoTarea("EST002");
                for (Tarea tarea : tareas) {
                    tarea.setEstadoTarea(estadoTareaAnulada);
                }
                tareaRepository.saveAll(tareas);
            }
            reservaRepository.save(reservas.get(0));
        }else{
            throw new RuntimeException("La Reserva no se puede Cancelar en este estado: " + nombreEstadoReserva);
        }


        return "Reserva cancelada";
    }

}
