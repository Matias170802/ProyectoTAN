package com.tan.seminario.backend.CasosDeUsos.Reservas;

import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import com.tan.seminario.backend.Repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoReserva {
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private EstadoReservaRepository estadoReservaRepository;
    @Autowired
    private InmuebleRepository inmuebleRepository;


    public List<DTOReserva> obtenerReservas(String anio, String mes){

        //defino las fechas limites para buscar en la bd como condiciones
        LocalDateTime fechaInicio;
        LocalDateTime fechaFin;

        //analizo si mes es igual o no a "todos" para definir como hacer la consulta al repository de reservas
        int year = Integer.parseInt(anio);

        if (mes.equalsIgnoreCase("todos")) {

            fechaInicio = LocalDateTime.of(year, 1, 1, 0, 0);
            fechaFin = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        } else {

            int month = Integer.parseInt(mes);

            YearMonth yearMonth = YearMonth.of(year, month);

            fechaInicio = yearMonth.atDay(1).atStartOfDay();
            fechaFin = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        }

        List<Reserva> reservas = reservaRepository.findByFechaHoraInicioReservaBetween(fechaInicio, fechaFin);

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
            dtoReserva.setDescripcionReserva(reserva.getDescripcionReserva());
            dtoReserva.setNombreHuesped(reserva.getNombreHuesped());
            dtoReserva.setNumeroTelefonoHuesped(reserva.getNumeroTelefonoHuesped());
            if (reserva.getEmailHuesped() != null) {dtoReserva.setEmailHuesped(reserva.getEmailHuesped());}

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

    public List<DTOEstadoReserva> obtenerEstados() {
        List<EstadoReserva> estados = estadoReservaRepository.findAll();
        List<DTOEstadoReserva> dtos = new ArrayList<>();
        for (EstadoReserva e : estados) {
            DTOEstadoReserva dto = new DTOEstadoReserva();
            dto.setCodEstadoReserva(e.getCodEstadoReserva());
            dto.setNombreEstadoReserva(e.getNombreEstadoReserva());
            dtos.add(dto);
        }
        return dtos;
    }

    public List<DTOEstadoReserva> obtenerTipoTarea() {
        List<EstadoReserva> estados = estadoReservaRepository.findAll();
        List<DTOEstadoReserva> dtos = new ArrayList<>();
        for (EstadoReserva e : estados) {
            DTOEstadoReserva dto = new DTOEstadoReserva();
            dto.setCodEstadoReserva(e.getCodEstadoReserva());
            dto.setNombreEstadoReserva(e.getNombreEstadoReserva());
        }
        return dtos;
    }

    public List<DTOInmueble> obtenerInmuebles() {
        List<Inmueble> inmuebles = inmuebleRepository.findByFechaHoraBajaInmuebleIsNull();
        List<DTOInmueble> dtos = new ArrayList<>();
        for (Inmueble in : inmuebles) {
            DTOInmueble dto = new DTOInmueble();
            dto.setCodInmueble(in.getCodInmueble());
            dto.setNombreInmueble(in.getNombreInmueble());
            dto.setCapacidad(in.getCapacidad());
            dto.setPrecioPorNocheUSD(in.getPrecioPorNocheUSD());
            dtos.add(dto);
        }
        return dtos;
    }
}
