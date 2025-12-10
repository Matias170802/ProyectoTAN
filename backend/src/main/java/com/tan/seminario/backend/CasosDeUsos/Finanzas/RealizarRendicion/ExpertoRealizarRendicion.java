package com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOBalanceADevolver;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOEmpleados;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOInmuebles;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda.ExpertoRegistrarCotizacionMoneda;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoCaja;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.InmuebleCaja;
import com.tan.seminario.backend.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class ExpertoRealizarRendicion {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final MovimientoRepository movimientoRepository;
    private final InmuebleCajaRepository inmuebleCajaRepository;
    private final InmuebleRepository inmuebleRepository;
    private static final Logger log = LoggerFactory.getLogger(ExpertoRealizarRendicion.class);

    public ExpertoRealizarRendicion(EmpleadoRepository empleadoRepository, EmpleadoCajaRepository empleadoCajaRepository, MovimientoRepository movimientoRepository, InmuebleCajaRepository inmuebleCajaRepository, InmuebleRepository inmuebleRepository) {
        this.empleadoRepository = empleadoRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.movimientoRepository = movimientoRepository;
        this.inmuebleCajaRepository = inmuebleCajaRepository;
        this.inmuebleRepository = inmuebleRepository;
    }

    public List<DTOEmpleados> buscarEmpleados() {
        List<Empleado> empleadosActivos = empleadoRepository.findByFechaHoraBajaEmpleadoIsNull();

        //elimino los empleados que no tienen balance para rendir
        for (Empleado empleado: empleadosActivos) {
            EmpleadoCaja cajaEmpleado = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleado);

            if (cajaEmpleado.getBalanceARS().compareTo(BigDecimal.ZERO) <= 0 || cajaEmpleado.getBalanceUSD().compareTo(BigDecimal.ZERO) <= 0) {
                empleadosActivos.remove(empleado);
            }
        }

        //si ninguno puede rendir
        if (empleadosActivos.isEmpty()) {
            return null;
        }

        List<DTOEmpleados> dtos = new java.util.ArrayList<>();

        for (Empleado empleado: empleadosActivos) {
            DTOEmpleados dto = DTOEmpleados.builder()
                    .nombreEmpleado(empleado.getNombreEmpleado())
                    .dniEmpleado(empleado.getDniEmpleado())
                    .build();
        }

        return dtos;
    }

    public List<DTOInmuebles> buscarInmuebles() {
        List<Inmueble> inmueblesActivos = inmuebleRepository.findByFechaHoraBajaInmuebleIsNull();

        log.info("Inmuebles activos: " + inmueblesActivos.size());
        if (inmueblesActivos.isEmpty()) {
            return null;
        }

        List<DTOInmuebles> dtos = new java.util.ArrayList<>();

        for (Inmueble inmueble: inmueblesActivos) {
            DTOInmuebles dto = DTOInmuebles.builder()
                    .nombreInmueble(inmueble.getNombreInmueble())
                    .build();

            dtos.add(dto);
        }

        log.info("Inmuebles activos: " + dtos.size());
        return dtos;
    }

    public DTOBalanceADevolver buscarBalance(String identificador) {

        //busco si es un inmueble el que hace la rendicion
        Inmueble inmuebleSeleccionado = inmuebleRepository.findByCodInmueble(identificador);

        //si no es inmueble significa que se rinde un empleado
        if (inmuebleSeleccionado == null ) {
            Empleado empleadoSeleccionado = empleadoRepository.findByDniEmpleado(identificador).get();

            EmpleadoCaja cajaEmpleado = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoSeleccionado);

            DTOBalanceADevolver balanceADevolver = DTOBalanceADevolver.builder()
                    .balanceARS(cajaEmpleado.getBalanceARS())
                    .balanceUSD(cajaEmpleado.getBalanceUSD())
                    .build();

            return balanceADevolver;
        }

        //si no era un empleado entonces significa que es un inmueble
        InmuebleCaja cajaInmueble = inmuebleCajaRepository.findByInmuebleAndFechaHoraBajaInmuebleCajaIsNull(inmuebleSeleccionado);

        DTOBalanceADevolver balanceADevolver = DTOBalanceADevolver.builder()
                .balanceARS(cajaInmueble.getBalanceTotalARS())
                .balanceUSD(cajaInmueble.getBalanceTotalUSD())
                .build();

        return balanceADevolver;
    }
}
