package com.tan.seminario.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tan.seminario.backend.Entity.EstadoReserva;

public interface EstadoReservaRepository extends JpaRepository<EstadoReserva, Long> {
    EstadoReserva findByNombreEstadoReserva(String nombreEstadoReserva);

    EstadoReserva findByCodEstadoReserva(String codEstadoReserva);
}