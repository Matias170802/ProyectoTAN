package com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva;

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

    public String altaReserva(DTOReserva reserva){
        System.out.println("Alta de reserva");
        System.out.println(reserva);

        //Saco todos los datos importantes del DTO
        String codigoReserva = reserva.getCodReserva();
        String codigoInmueble = reserva.getCodInmueble();
        LocalDateTime fechaHoraCheckin = reserva.getFechaHoraCheckin();
        LocalDateTime fechaHoraCheckout = reserva.getFechaHoraCheckout();
        String plataformaOrigen = reserva.getPlataformaOrigen();

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
}

    public List<DTOReserva> modificarReservas(String codReserva, DTOModificarReserva dtoModificarReserva){
    List<Reserva> reserva = ReservaRepository.findByCodReserva(codReserva).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }
