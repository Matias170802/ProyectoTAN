package com.tan.seminario.backend.CasosDeUsos.Reservas.CancelarReserva;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.ExpertoRegistrarCotizacionMoneda;
import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.ReservaRepository;
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

    public String cancelarReserva(String codReserva){
        List<Reserva> reservas = reservaRepository.findByCodReserva(codReserva);
        if (reservas.isEmpty()) {
            throw new RuntimeException("No se encuentra la Reserva con el Codigo: " + codReserva);
        }

        EstadoReserva estadoReserva = reservas.get(0).getEstadoReserva();
        String nombreEstadoReserva = estadoReserva.getNombreEstadoReserva();

        if (nombreEstadoReserva.equals("Señada") || nombreEstadoReserva.equals("Preparada")){
            EstadoReserva estadoReservaCancelada = estadoReservaRepository.findByCodEstadoReserva("EST002");
            if (estadoReservaCancelada == null) {
                throw new RuntimeException("No se encuentra el Estado de Reserva Cancelada");
            }
            reservas.get(0).setEstadoReserva(estadoReservaCancelada);
            reservaRepository.save(reservas.get(0));
        }else{
            throw new RuntimeException("La Reserva no se puede Cancelar en este estado: " + nombreEstadoReserva);
        }


        return "Reserva cancelada";
    }

}
