package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Moneda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonedaRepository extends JpaRepository<Moneda, Long> {

    List<Moneda> findByfechaHoraBajaMonedaIsNull();
    Moneda findByNombreMoneda(String nombreMoneda);
}
