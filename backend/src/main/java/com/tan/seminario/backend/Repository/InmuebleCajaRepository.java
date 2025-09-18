package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.InmuebleCaja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InmuebleCajaRepository extends JpaRepository<InmuebleCaja, Long> {
    List<InmuebleCaja> findInmuebleCajaByFechaHoraBajaInmuebleCajaIsNull();
}
