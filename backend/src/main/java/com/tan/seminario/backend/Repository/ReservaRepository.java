package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByCodReserva(String codReserva);
    List<Reserva> findByInmueble_CodInmueble(String codInmueble);
    List<Reserva> findByInmueble(Inmueble inmueble);
    List<Reserva> findByFechaHoraAltaReservaBetweenOrderByFechaHoraAltaReserva(
            LocalDateTime fechaHoraAltaReservaAfter,
            LocalDateTime fechaHoraAltaReservaBefore);
    List<Reserva> findByEstadoReservaAndRendidaAInmuebleIsFalseAndInmueble(EstadoReserva estadoReserva, Inmueble inmueble);
    List<Reserva> findByEstadoReservaAndFechaHoraInicioReservaBetween(EstadoReserva estadoReserva, LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin);
    List<Reserva> findByEstadoReservaAndInmuebleAndFechaHoraInicioReservaBetween(EstadoReserva estadoReserva, Inmueble inmueble,LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin);

    List<Reserva> findByFechaHoraInicioReservaBetween(LocalDateTime fechaHoraInicioReservaAfter, LocalDateTime fechaHoraInicioReservaBefore);
}