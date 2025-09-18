package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.EmpleadoCaja;
import com.tan.seminario.backend.Entity.InmuebleCaja;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Repository.CajaMadreRepository;
import com.tan.seminario.backend.Repository.EmpleadoCajaRepository;
import com.tan.seminario.backend.Repository.InmuebleCajaRepository;
import com.tan.seminario.backend.Repository.MovimientoRepository;
import org.springframework.stereotype.Service;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOCajas;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoFinanzas {

    private final CajaMadreRepository cajaMadreRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final InmuebleCajaRepository inmuebleCajaRepository;
    private final MovimientoRepository movimientoRepository;

    public ExpertoFinanzas(CajaMadreRepository cajaMadreRepository,
                           EmpleadoCajaRepository empleadoCajaRepository,
                           InmuebleCajaRepository inmuebleCajaRepository,
                           MovimientoRepository movimientoRepository) {

        this.cajaMadreRepository = cajaMadreRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.inmuebleCajaRepository = inmuebleCajaRepository;
        this.movimientoRepository = movimientoRepository;
    }


    public List<DTOCajas> buscarCajas () {
        List<DTOCajas> cajasAEnviar = new ArrayList<>();

        List<CajaMadre> cajasMadresExistentes = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull();
        for (CajaMadre cajamadre: cajasMadresExistentes) {
            LocalDateTime fechaUltimoMovimiento = movimientoRepository
                    .findTopByCajaMadreOrderByFechaMovimientoDesc(cajamadre)
                    .map(Movimiento::getFechaMovimiento) // aplica getFechaMovimiento solo si existe por lo que es optional
                    .orElse(null);

            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(cajamadre.getBalanceTotalARS())
                    .balanceUSD(cajamadre.getBalanceTotalUSD())
                    .tipo("Otro")
                    .nombre(cajamadre.getNombreCajaMadre())
                    .ultimoMovimiento(fechaUltimoMovimiento)
                    .build();
            cajasAEnviar.add(dto);
        }

        List<EmpleadoCaja> empleadoCajasExistentes = empleadoCajaRepository.findEmpleadoCajaByFechaHoraBajaEmpleadoCajaIsNull();
        for (EmpleadoCaja empleadocaja: empleadoCajasExistentes) {
            LocalDateTime fechaUltimoMovimiento = movimientoRepository
                    .findTopByEmpleadoCajaOrderByFechaMovimientoDesc(empleadocaja)
                    .map(Movimiento::getFechaMovimiento) // aplica getFechaMovimiento solo si existe por lo que es optional
                    .orElse(null);

            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(empleadocaja.getBalanceARS())
                    .balanceUSD(empleadocaja.getBalanceUSD())
                    .tipo("Empleado")
                    .nombre(empleadocaja.getNombreEmpleadoCaja())
                    .ultimoMovimiento(fechaUltimoMovimiento)
                    .build();
            cajasAEnviar.add(dto);
        }

        List<InmuebleCaja> inmueblesCajasExistentes = inmuebleCajaRepository.findInmuebleCajaByFechaHoraBajaInmuebleCajaIsNull();
        for (InmuebleCaja inmueblecaja: inmueblesCajasExistentes) {
            LocalDateTime fechaUltimoMovimiento = movimientoRepository
                    .findTopByInmuebleCajaOrderByFechaMovimientoDesc(inmueblecaja)
                    .map(Movimiento::getFechaMovimiento) // aplica getFechaMovimiento solo si existe por lo que es optional
                    .orElse(null);

            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(inmueblecaja.getBalanceTotalARS())
                    .balanceUSD(inmueblecaja.getBalanceTotalUSD())
                    .tipo("Inmueble")
                    .nombre(inmueblecaja.getNombreInmuebleCaja())
                    .ultimoMovimiento(fechaUltimoMovimiento)
                    .build();
            cajasAEnviar.add(dto);
        }

        return cajasAEnviar;
    }
}
