package com.tan.seminario.backend.Repository;


import com.tan.seminario.backend.Entity.Inmueble;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InmuebleRepository extends JpaRepository<Inmueble, Long> {
    Inmueble findByCodInmueble(String codInmueble);
    List<Inmueble> findByFechaHoraBajaInmuebleIsNull();
}
