package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOBalance;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOMovimientos;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOCajas;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertoFinanzas {

    private final CajaMadreRepository cajaMadreRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final InmuebleCajaRepository inmuebleCajaRepository;
    private final MovimientoRepository movimientoRepository;
    private final UsuarioRepository usuarioRepository;

    public ExpertoFinanzas(CajaMadreRepository cajaMadreRepository,
                           EmpleadoCajaRepository empleadoCajaRepository,
                           InmuebleCajaRepository inmuebleCajaRepository,
                           MovimientoRepository movimientoRepository,
                           UsuarioRepository usuarioRepository) {

        this.cajaMadreRepository = cajaMadreRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.inmuebleCajaRepository = inmuebleCajaRepository;
        this.movimientoRepository = movimientoRepository;
        this.usuarioRepository = usuarioRepository;
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

    public List<DTOMovimientos> buscarMovimientos (String username) {

        //busco el empleado mediante el usuario que tiene iniciada sesion
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();
        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        //busco la caja del empleado
        EmpleadoCaja cajaEmpleadoActivo = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoActivo);

        //busco los movimientos relacionados a esa caja
        List<Movimiento> movimientos = movimientoRepository
                .findByEmpleadoCajaOrderByFechaMovimientoDesc(cajaEmpleadoActivo)
                .orElseThrow(() -> new RuntimeException(
                        "No hay movimientos registrados en la caja seleccionada"
                ));

        //creo el list de dtos para enviar
        List<DTOMovimientos> dtos = new ArrayList<>();

        for (Movimiento movimiento: movimientos) {
            DTOMovimientos dto = DTOMovimientos.builder()
                    .monedaMovimiento(movimiento.getMoneda().getNombreMoneda())
                    .fechaMovimiento(movimiento.getFechaMovimiento())
                    .montoMovimiento(movimiento.getMontoMovimiento())
                    .categoriaMovimiento(movimiento.getCategoriaMovimiento().getNombreCategoriaMovimiento())
                    .tipoMovimiento(movimiento.getTipoMovimiento().getNombreTipoMovimiento())
                    .descripcionMovimiento(movimiento.getDescripcionMovimiento())
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }

    public DTOBalance buscarBalance(String username) {
        //busco el empleado mediante el usuario que tiene iniciada sesion
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();
        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        //busco la caja del empleado
        EmpleadoCaja cajaEmpleadoActivo = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoActivo);

        DTOBalance dtoBalance = DTOBalance.builder()
                .balanceARS(cajaEmpleadoActivo.getBalanceARS())
                .balanceUSD(cajaEmpleadoActivo.getBalanceUSD())
                .build();

        return dtoBalance;
    }
}
