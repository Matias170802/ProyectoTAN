package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByNroTarea(Long nroTarea);
}
