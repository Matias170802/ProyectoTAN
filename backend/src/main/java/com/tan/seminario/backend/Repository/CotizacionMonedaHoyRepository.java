package com.tan.seminario.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;

import java.time.LocalDate;
import java.util.List;

public interface CotizacionMonedaHoyRepository extends JpaRepository<CotizacionMonedaHoy, Long>{

    List<CotizacionMonedaHoy> findByFechaCotizacionMoneda(LocalDate fechaActual);
}