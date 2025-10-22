package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByCodReserva(String codReserva);

    List<Reserva> findByFechaHoraAltaReservaBetweenOrderByFechaHoraAltaReserva(
            LocalDateTime fechaHoraAltaReservaAfter,
            LocalDateTime fechaHoraAltaReservaBefore);

}