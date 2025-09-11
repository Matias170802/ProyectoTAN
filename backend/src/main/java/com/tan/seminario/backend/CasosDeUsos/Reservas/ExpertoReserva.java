package com.tan.seminario.backend.CasosDeUsos.Reservas;

import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoReserva {
    @Autowired
    private ReservaRepository reservaRepository;


    public List<DTOReserva> obtenerReservas(){
        LocalDateTime hasta = LocalDateTime.now();
        LocalDateTime desde = hasta.minusDays(30);

        //Busca las reservas creadas en los ultimos 30 dias
        List<Reserva> reservas = reservaRepository.findByFechaHoraAltaReservaBetweenOrderByFechaHoraAltaReserva(desde, hasta);

        List<DTOReserva> DTOReservasEnviar = new ArrayList<>();
        for (Reserva reserva : reservas) {
            DTOReserva dtoReserva = new DTOReserva();
            //Sets Reserva
            dtoReserva.setCodReserva(reserva.getCodReserva());
            dtoReserva.setFechaHoraCheckin(reserva.getFechaHoraInicioReserva());
            dtoReserva.setFechaHoraCheckout(reserva.getFechaHoraFinReserva());
            dtoReserva.setFechaHoraAltaReserva(reserva.getFechaHoraAltaReserva());
            dtoReserva.setTotalDias(reserva.getTotalDias());
            dtoReserva.setCantHuespedes(reserva.getCantidadHuespedes());
            dtoReserva.setTotalMonto(reserva.getTotalMonto());
            dtoReserva.setTotalMontoSenia(reserva.getTotalMontoSenia());
            dtoReserva.setPlataformaOrigen(reserva.getPlataformaOrigen());

            //Sets EstadoReserva
            EstadoReserva estadoReserva = reserva.getEstadoReserva();
            dtoReserva.setCodEstadoReserva(estadoReserva.getCodEstadoReserva());
            dtoReserva.setNombreEstadoReserva(estadoReserva.getNombreEstadoReserva());

            //Sets Inmueble
            Inmueble inmueblereserva = reserva.getInmueble();
            dtoReserva.setCodInmueble(inmueblereserva.getCodInmueble());
            dtoReserva.setNombreInmueble(inmueblereserva.getNombreInmueble());

            DTOReservasEnviar.add(dtoReserva);
        }

        return DTOReservasEnviar;
    }
}
