package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.TipoTarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoTareaRepository extends JpaRepository<TipoTarea, Long> {
    List<TipoTarea> findByCodTipoTarea(String codTipoTarea);
}
