package com.tan.seminario.backend.CasosDeUsos.Finanzas.PagoSueldos;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.PagoSueldos.DTOs.DTOEmpleadosASeleccionar;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.fasterxml.jackson.datatype.jsr310.DecimalUtils.toBigDecimal;
import static org.hibernate.type.descriptor.java.CoercionHelper.toDouble;

@Service
public class ExpertoPagoSueldos {

    private final EmpleadoRepository empleadoRepository;
    private final MovimientoRepository movimientoRepository;
    private final CajaMadreRepository cajaMadreRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final MonedaRepository monedaRepository;

    public ExpertoPagoSueldos(EmpleadoRepository empleadoRepository, MovimientoRepository movimientoRepository, CajaMadreRepository cajaMadreRepository, TipoMovimientoRepository tipoMovimientoRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, EmpleadoCajaRepository empleadoCajaRepository, MonedaRepository monedaRepository) {
        this.empleadoRepository = empleadoRepository;
        this.movimientoRepository = movimientoRepository;
        this.cajaMadreRepository = cajaMadreRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.monedaRepository = monedaRepository;
    }

    public List<DTOEmpleadosASeleccionar> buscarEmpleadosASeleccionar() {
        List<Empleado> empleadosActivos = empleadoRepository.findByFechaHoraBajaEmpleadoIsNull();

        List<DTOEmpleadosASeleccionar> dtos = new java.util.ArrayList<>();

        for (Empleado empleado: empleadosActivos) {
            DTOEmpleadosASeleccionar dto = DTOEmpleadosASeleccionar.builder()
                    .sueldoEmpleado(empleado.getSalarioEmpleado())
                    .nombreEmpleado(empleado.getNombreEmpleado())
                    .dniEmpleado(empleado.getDniEmpleado())
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }

    public void pagarSueldo (String dniEmpleado) {
        //busco el empleado al que le voy a pagar el sueldo
        Empleado empleadoAPagar = empleadoRepository.findByDniEmpleado(dniEmpleado).get();

        LocalDateTime fechaUltimoCobro = empleadoAPagar.getFechaUltimoCobroSalario();

        // si ya tiene una fecha de último cobro, la valido
        if (fechaUltimoCobro != null) {

            long diasTranscurridos = ChronoUnit.DAYS.between(fechaUltimoCobro, LocalDateTime.now());

            if (diasTranscurridos < 30) {
                throw new RuntimeException("Ya se le ha pagado el sueldo mensual al empleado seleccionado");
            }
        }

        //busco instancia de caja madre
        List<CajaMadre> cajaMadre = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull();

        //busco instancia de cajaEmpleado
        EmpleadoCaja empleadoCaja = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoAPagar);

        //leo su salario
        BigDecimal sueldoEmpleado = BigDecimal.valueOf(empleadoAPagar.getSalarioEmpleado());

        //me fijo si el empleado tiene saldo a su favor
        if (empleadoCaja.getBalanceARS().compareTo(BigDecimal.ZERO) > 0) {

            sueldoEmpleado = sueldoEmpleado.subtract(empleadoCaja.getBalanceARS());

        } else if (empleadoCaja.getBalanceARS().compareTo(BigDecimal.ZERO) < 0) {

            sueldoEmpleado = sueldoEmpleado.add(empleadoCaja.getBalanceARS());
        }

        //busco los tipos de movimientos para asignarselos a los movimientos
        TipoMovimiento tipoMovimientoIngreso = tipoMovimientoRepository.findBynombreTipoMovimientoAndFechaHoraBajaTipoMovimientoIsNull("Ingreso");
        TipoMovimiento tipoMovimientoEgreso = tipoMovimientoRepository.findBynombreTipoMovimientoAndFechaHoraBajaTipoMovimientoIsNull("Egreso");

        //busco la categoria movimiento para asignarselas
        CategoriaMovimiento categoriaMovimientoAAsignar = categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Sueldo");

        //moneda para asignar al movimiento
        Moneda monedaAAsignar = monedaRepository.findBynombreMonedaAndFechaHoraBajaMonedaIsNull("Peso Argentino");

        //creo movimiento egreso en pesos en la caja madre
        Movimiento movimientoCajaMadre = Movimiento.builder()
                .tipoMovimiento(tipoMovimientoEgreso)
                .fechaMovimiento(LocalDateTime.now())
                .categoriaMovimiento(categoriaMovimientoAAsignar)
                .moneda(monedaAAsignar)
                .cajaMadre(cajaMadre.get(0))
                .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                .montoMovimiento(Double.valueOf(sueldoEmpleado.doubleValue()))
                .build();

        movimientoRepository.save(movimientoCajaMadre);

        Movimiento movimientoEmpleadoCaja = Movimiento.builder()
                .tipoMovimiento(tipoMovimientoIngreso)
                .fechaMovimiento(LocalDateTime.now())
                .categoriaMovimiento(categoriaMovimientoAAsignar)
                .moneda(monedaAAsignar)
                .empleadoCaja(empleadoCaja)
                .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                .montoMovimiento(Double.valueOf(sueldoEmpleado.doubleValue()))
                .build();

        movimientoRepository.save(movimientoEmpleadoCaja);

        //actualizo los balances de las cajas
        BigDecimal nuevoBalanceCajaMadre = cajaMadre.get(0).getBalanceTotalARS().subtract(sueldoEmpleado);
        cajaMadre.get(0).setBalanceTotalARS(nuevoBalanceCajaMadre);
        empleadoCaja.setBalanceARS(BigDecimal.ZERO);

        cajaMadreRepository.save(cajaMadre.get(0));
        empleadoCajaRepository.save(empleadoCaja);

        //modifico fecha del cobro del sueldo del empleado
        empleadoAPagar.setFechaUltimoCobroSalario(LocalDateTime.now());

        empleadoRepository.save(empleadoAPagar);

    }
}
