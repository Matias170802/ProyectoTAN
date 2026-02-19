package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.EstadoTarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstadoTareaRepository extends JpaRepository<EstadoTarea, Long> {
    EstadoTarea findByNombreEstadoTarea(String nombreEstadoTarea);

    EstadoTarea findByCodEstadoTarea(String codEstadoTarea);
}
