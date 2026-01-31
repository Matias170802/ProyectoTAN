package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOBalance;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOMovimientos;
import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.DTORoles;
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

    public List<DTOMovimientos> buscarMovimientosCajaMadre (String username) {

        //busco el empleado mediante el usuario que tiene iniciada sesion
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();
        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        //busco la caja madre
        CajaMadre cajaMadreActiva = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull().get(0);

        //busco los movimientos relacionados a esa caja
        List<Movimiento> movimientos = movimientoRepository
                .findByCajaMadreOrderByFechaMovimientoDesc(cajaMadreActiva)
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

    public DTOBalance buscarBalanceCajaMadre(String username) {
        //busco el empleado mediante el usuario que tiene iniciada sesion
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();
        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        //busco la caja madre
        CajaMadre cajaMadreActiva = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull().get(0);

        DTOBalance dtoBalance = DTOBalance.builder()
                .balanceARS(cajaMadreActiva.getBalanceTotalARS())
                .balanceUSD(cajaMadreActiva.getBalanceTotalUSD())
                .build();

        return dtoBalance;
    }

    //obtener roles

    public List<DTORoles> obtenerRoles(String username) {
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();

        //busco instancia de empleado relacioada al usuario activo
        Empleado empleado = usuarioActivo.getEmpleado();

        //creo la instancia de la lista que va a contener el DTORoles
        List<DTORoles> dtosRoles = new java.util.ArrayList<>();

        //Me busco los roles que tiene el empleado
        List<EmpleadoRol> instanciasRol = empleado.getEmpleadosRoles();

        for (EmpleadoRol empleadoRol: instanciasRol) {
            //creo el dtoRol
            DTORoles dto = DTORoles.builder()
                    .nombreRol(empleadoRol.getRol().getNombreRol())
                    .build();

            dtosRoles.add(dto);
        }

        return dtosRoles;
    }
}
