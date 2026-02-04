package com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva.DTOsAMReserva.DTOModificarReserva;
import com.tan.seminario.backend.CasosDeUsos.Reservas.DTOReserva;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoAMReserva {
    private final InmuebleRepository inmuebleRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final ReservaRepository reservaRepository;
    private final MovimientoRepository movimientoRepository;
    private final CajaMadreRepository cajaMadreRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final MonedaRepository monedaRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;

    public ExpertoAMReserva(InmuebleRepository inmuebleRepository, EstadoReservaRepository estadoReservaRepository, ReservaRepository reservaRepository, MovimientoRepository movimientoRepository, CajaMadreRepository cajaMadreRepository, TipoMovimientoRepository tipoMovimientoRepository, MonedaRepository monedaRepository, CategoriaMovimientoRepository categoriaMovimientoRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.estadoReservaRepository = estadoReservaRepository;
        this.reservaRepository = reservaRepository;
        this.movimientoRepository = movimientoRepository;
        this.cajaMadreRepository = cajaMadreRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.monedaRepository = monedaRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
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
            // Ignorar reservas canceladas
            EstadoReserva estado = reservaInmueble.getEstadoReserva();
            if (estado != null && "Cancelado".equalsIgnoreCase(estado.getNombreEstadoReserva())) {
                continue;
            }

            LocalDateTime fechaCheckInReservaVieja = reservaInmueble.getFechaHoraInicioReserva();
            LocalDateTime fechaCheckOutReservaVieja = reservaInmueble.getFechaHoraFinReserva();

            if (fechaHoraCheckin.isBefore(fechaCheckOutReservaVieja) && fechaHoraCheckout.isAfter(fechaCheckInReservaVieja)) {
                return "Ya existe una reserva para ese inmueble en esas fechas";
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

        CajaMadre cajaMadre = cajaMadreRepository.findByNroCajaMadre(1l);
        TipoMovimiento ingreso = tipoMovimientoRepository.findBynombreTipoMovimiento("Ingreso");
        CategoriaMovimiento categoriaMovimiento = categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Seña");
        Moneda moneda = monedaRepository.findBynombreMoneda("Dolar");

        Movimiento movimiento = Movimiento.builder()
                .nroMovimiento(movimientoRepository.count() + 1)
                .fechaMovimiento(LocalDateTime.now())
                .montoMovimiento(reservaCreada.getTotalMontoSenia())
                .cajaMadre(cajaMadre)
                .tipoMovimiento(ingreso)
                .categoriaMovimiento(categoriaMovimiento)
                .moneda(moneda)
                .reserva(reservaCreada)
                .build();

        EstadoReserva estadoReserva = estadoReservaRepository.findByNombreEstadoReserva("Señada");
        reservaCreada.setEstadoReserva(estadoReserva);

        reservaRepository.save(reservaCreada);
        movimientoRepository.save(movimiento);

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

        Inmueble inmueble = reservaModificada.getInmueble();
        //Revisamos que no exista una reserva en ese inmueble para la misma fecha
        List<Reserva> reservasInmueble = reservaRepository.findByInmueble(inmueble);
        for (Reserva reservaInmueble : reservasInmueble) {
            // Ignorar la misma reserva que estamos modificando
            if (reservaInmueble.getCodReserva() != null && reservaInmueble.getCodReserva().equals(codReserva)) {
                continue;
            }
            // Ignorar reservas canceladas
            EstadoReserva est = reservaInmueble.getEstadoReserva();
            if (est != null && "Cancelado".equalsIgnoreCase(est.getNombreEstadoReserva())) {
                continue;
            }

            LocalDateTime fechaCheckInReservaVieja = reservaInmueble.getFechaHoraInicioReserva();
            LocalDateTime fechaCheckOutReservaVieja = reservaInmueble.getFechaHoraFinReserva();

            if (fechaHoraInicioReserva.isBefore(fechaCheckOutReservaVieja) && fechaHoraFinReserva.isAfter(fechaCheckInReservaVieja)) {
                return "Ya existe una reserva para ese inmueble en esas fechas";
            }
        }

        Reserva reservaGuardada = reservaRepository.save(reservaModificada);

        return "Reserva Modificada";

    }
}
