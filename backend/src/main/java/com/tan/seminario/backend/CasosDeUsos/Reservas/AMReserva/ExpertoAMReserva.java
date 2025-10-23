package com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva.DTOsAMReserva.DTOModificarReserva;
import com.tan.seminario.backend.CasosDeUsos.Reservas.DTOReserva;
import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import com.tan.seminario.backend.Repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoAMReserva {
    private final InmuebleRepository inmuebleRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final ReservaRepository reservaRepository;

    public ExpertoAMReserva(InmuebleRepository inmuebleRepository, EstadoReservaRepository estadoReservaRepository, ReservaRepository reservaRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.estadoReservaRepository = estadoReservaRepository;
        this.reservaRepository = reservaRepository;
    }

    public String altaReserva(DTOReserva reserva) {
        System.out.println("Alta de reserva");
        System.out.println(reserva);

        //Saco todos los datos importantes del DTO
        String codigoReserva = reserva.getCodReserva();
        String codigoInmueble = reserva.getCodInmueble();
        LocalDateTime fechaHoraCheckin = reserva.getFechaHoraCheckin();
        LocalDateTime fechaHoraCheckout = reserva.getFechaHoraCheckout();
        String plataformaOrigen = reserva.getPlataformaOrigen();

        //Revisamos que no exista una reserva en ese inmueble para la misma fecha
        List<Reserva> reservasInmueble = reservaRepository.findByInmueble_CodInmueble(codigoInmueble);
        for (Reserva reservaInmueble : reservasInmueble) {
            LocalDateTime fechaCheckInReservaVieja = reservaInmueble.getFechaHoraInicioReserva();
            LocalDateTime fechaCheckOutReservaVieja = reservaInmueble.getFechaHoraFinReserva();

            if (fechaHoraCheckin.isBefore(fechaCheckOutReservaVieja)&& fechaHoraCheckout.isAfter(fechaCheckOutReservaVieja)) {

            }
        }

        if (codigoReserva == null)
            throw new IllegalArgumentException("El codigo de reserva no puede ser null");
        if (codigoInmueble == null)
            throw new IllegalArgumentException("El codigo de inmueble no puede ser null");
        if (fechaHoraCheckin == null)
            throw new IllegalArgumentException("La fecha de checkin no puede ser null");
        if (fechaHoraCheckout == null)
            throw new IllegalArgumentException("La fecha de checkout no puede ser null");
        if (plataformaOrigen == null)
            throw new IllegalArgumentException("La plataforma de origen no puede ser null");

        Reserva reservaCreada = new Reserva();
        reservaCreada.setCodReserva(codigoReserva);
        reservaCreada.setFechaHoraInicioReserva(fechaHoraCheckin);
        reservaCreada.setFechaHoraFinReserva(fechaHoraCheckout);
        reservaCreada.setFechaHoraAltaReserva(LocalDateTime.now());
        reservaCreada.setTotalDias(fechaHoraCheckout.getDayOfYear() - fechaHoraCheckin.getDayOfYear());
        reservaCreada.setCantidadHuespedes(reserva.getCantHuespedes());
        reservaCreada.setTotalMonto(reserva.getTotalMonto());
        reservaCreada.setTotalMontoSenia(reserva.getTotalMontoSenia());
        reservaCreada.setPlataformaOrigen(plataformaOrigen);
        reservaCreada.setDescripcionReserva(reserva.getDescripcionReserva());
        reservaCreada.setNombreHuesped(reserva.getNombreHuesped());
        reservaCreada.setNumeroTelefonoHuesped(reserva.getNumeroTelefonoHuesped());
        reservaCreada.setEmailHuesped(reserva.getEmailHuesped());

        Inmueble inmueble = inmuebleRepository.findByCodInmueble(codigoInmueble);
        reservaCreada.setInmueble(inmueble);

        EstadoReserva estadoReserva = estadoReservaRepository.findByNombreEstadoReserva("Señada");
        reservaCreada.setEstadoReserva(estadoReserva);

        Reserva reservaGuardada = reservaRepository.save(reservaCreada);

        if (reservaGuardada == null) {
            throw new IllegalArgumentException("No se pudo guardar la reserva");
        }
        return "Reserva Creada";
    }


    public String modificarReservas(String codReserva, DTOModificarReserva dtoModificarReserva) {
        List<Reserva> reserva = reservaRepository.findByCodReserva(codReserva);
        if (reserva.isEmpty()) {
            throw new IllegalArgumentException("No se pudo encontrar la reserva con el codigo " + codReserva);
        }
        Reserva reservaModificada = reserva.get(0);

        // Modificamos la Reserva con los nuevos valores modificados
        LocalDateTime fechaHoraInicioReserva = dtoModificarReserva.getFechaHoraInicioReserva();
        LocalDateTime fechaHoraFinReserva = dtoModificarReserva.getFechaHoraFinReserva();
        String nombreHuesped = dtoModificarReserva.getNombreHuesped();
        String numeroTelefonoHuesped = dtoModificarReserva.getNumeroTelefonoHuesped();
        String emailHuesped = dtoModificarReserva.getEmailHuesped();
        String descripcionReserva = dtoModificarReserva.getDescripcionReserva();
        Integer totalDias = dtoModificarReserva.getTotalDias();
        Integer cantidadHuespedes = dtoModificarReserva.getCantidadHuespedes();
        Double totalMonto = dtoModificarReserva.getTotalMonto();
        Double totalMontoSenia = dtoModificarReserva.getTotalMontoSenia();
        Double totalMontoCheckIn = dtoModificarReserva.getTotalMontoCheckIn();
        String plataformaOrigen = dtoModificarReserva.getPlataformaOrigen();

        if (fechaHoraInicioReserva != null) {
            reservaModificada.setFechaHoraInicioReserva(fechaHoraInicioReserva);
        }
        if (fechaHoraFinReserva != null) {
            reservaModificada.setFechaHoraFinReserva(fechaHoraFinReserva);
        }
        if (nombreHuesped != null) {
            reservaModificada.setNombreHuesped(nombreHuesped);
        }
        if (numeroTelefonoHuesped != null) {
            reservaModificada.setNumeroTelefonoHuesped(numeroTelefonoHuesped);
        }
        if (emailHuesped != null) {
            reservaModificada.setEmailHuesped(emailHuesped);
        }
        if (descripcionReserva != null) {
            reservaModificada.setDescripcionReserva(descripcionReserva);
        }
        if (totalDias != null) {
            reservaModificada.setTotalDias(totalDias);
        }
        if (cantidadHuespedes != null) {
            reservaModificada.setCantidadHuespedes(cantidadHuespedes);
        }
        if (totalMonto != null) {
            reservaModificada.setTotalMonto(totalMonto);
        }
        if (totalMontoSenia != null) {
            reservaModificada.setTotalMontoSenia(totalMontoSenia);
        }
        if (totalMontoCheckIn != null) {
            reservaModificada.setTotalMontoCheckIn(totalMontoCheckIn);
        }
        if (plataformaOrigen != null) {
            reservaModificada.setPlataformaOrigen(plataformaOrigen);
        }

        Reserva reservaGuardada = reservaRepository.save(reservaModificada);

        if (reservaGuardada == null) {
            throw new IllegalArgumentException("No se pudo guardar la reserva");
        }
        return "Reserva Modificada";

    }
}
