package com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOBalanceADevolver;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOEmpleados;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOInmuebles;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTORealizarRendicion;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda.ExpertoRegistrarCotizacionMoneda;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.hibernate.type.descriptor.java.CoercionHelper.toDouble;


@Service
public class ExpertoRealizarRendicion {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final MovimientoRepository movimientoRepository;
    private final InmuebleCajaRepository inmuebleCajaRepository;
    private final InmuebleRepository inmuebleRepository;
    private final CajaMadreRepository cajaMadreRepository;
    private final ReservaRepository reservaRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final MonedaRepository monedaRepository;

    private static final Logger log = LoggerFactory.getLogger(ExpertoRealizarRendicion.class);

    public ExpertoRealizarRendicion(EmpleadoRepository empleadoRepository, EmpleadoCajaRepository empleadoCajaRepository, MovimientoRepository movimientoRepository, InmuebleCajaRepository inmuebleCajaRepository, InmuebleRepository inmuebleRepository, CajaMadreRepository cajaMadreRepository, ReservaRepository reservaRepository, EstadoReservaRepository estadoReservaRepository, CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, TipoMovimientoRepository tipoMovimientoRepository, MonedaRepository monedaRepository) {
        this.empleadoRepository = empleadoRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.movimientoRepository = movimientoRepository;
        this.inmuebleCajaRepository = inmuebleCajaRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.cajaMadreRepository = cajaMadreRepository;
        this.reservaRepository = reservaRepository;
        this.estadoReservaRepository = estadoReservaRepository;
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.monedaRepository = monedaRepository;
    }

    public List<DTOEmpleados> buscarEmpleados() {
        List<Empleado> empleadosActivos = empleadoRepository.findByFechaHoraBajaEmpleadoIsNull();

        // Stream para filtrar empleados que puedan rendir
        List<Empleado> empleadosConBalance = empleadosActivos.stream()
                .filter(empleado -> {
                    EmpleadoCaja cajaEmpleado =
                            empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleado);

                    // Si no tiene caja → afuera
                    if (cajaEmpleado == null) {
                        return false;
                    }

                    boolean tieneARS = cajaEmpleado.getBalanceARS() != null
                            && cajaEmpleado.getBalanceARS().compareTo(BigDecimal.ZERO) > 0;

                    boolean tieneUSD = cajaEmpleado.getBalanceUSD() != null
                            && cajaEmpleado.getBalanceUSD().compareTo(BigDecimal.ZERO) > 0;

                    // Debe tener ARS positivo o USD positivo
                    return tieneARS || tieneUSD;
                })
                .toList();

        // Si ninguno puede rendir
        if (empleadosConBalance.isEmpty()) {
            return null;
        }

        // Map a DTOs
        return empleadosConBalance.stream()
                .map(empleado -> DTOEmpleados.builder()
                        .nombreEmpleado(empleado.getNombreEmpleado())
                        .dniEmpleado(empleado.getDniEmpleado())
                        .build()
                )
                .toList();
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
                    .codInmueble(inmueble.getCodInmueble())
                    .build();

            dtos.add(dto);
        }

        log.info("Inmuebles activos: " + dtos.size());
        return dtos;
    }

    public DTOBalanceADevolver buscarBalance(String identificador) {

        //busco si es un inmueble el que hace la rendicion
        Inmueble inmuebleSeleccionado = inmuebleRepository.findByCodInmueble(identificador);

        log.info("Inmueble seleccionado: " + inmuebleSeleccionado);

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

        //si no era un empleado entonces es inmueble

        //busco el estado que tienen que tener las reservas
        EstadoReserva estadoReserva = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");
        //armo el monto que se deberia pagar al inmueble
        List<Reserva> reservasARendir = reservaRepository.findByEstadoReservaAndRendidaAInmuebleIsFalseAndInmueble(estadoReserva, inmuebleSeleccionado);

        if (reservasARendir.isEmpty()) {
            throw new RuntimeException(
                    "No hay reservas para rendir");
        }

        BigDecimal valorXNocheInmueble = BigDecimal.valueOf(inmuebleSeleccionado.getPrecioPorNocheUSD());
        BigDecimal totalPagarUSD = BigDecimal.ZERO;

        //calculo el total a pagar en USD
        for (Reserva reserva: reservasARendir) {
            totalPagarUSD = valorXNocheInmueble.multiply(BigDecimal.valueOf(reserva.getTotalDias()));
        }

        //si no hay reservas para rendir
        if (totalPagarUSD.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("No hay reservas para rendir");
        }

        //se analiza si tienen deudas pendientes con la empresa
        InmuebleCaja cajaInmueble = inmuebleCajaRepository.findByInmuebleAndFechaHoraBajaInmuebleCajaIsNull(inmuebleSeleccionado);

        if (cajaInmueble.getBalanceTotalUSD().compareTo(BigDecimal.ZERO) < 0 ) {
            //se suma pero en realidad es una resta ya que el balance en usd es negativo
            totalPagarUSD = totalPagarUSD.add(cajaInmueble.getBalanceTotalUSD());
        } else if (cajaInmueble.getBalanceTotalARS().compareTo(BigDecimal.ZERO) < 0)
        {
            //busco la cotizacion del dolar
            CotizacionMonedaHoy cotizacionDolarHoy = cotizacionMonedaHoyRepository.findByFechaCotizacionMonedaAndMoneda_NombreMoneda(LocalDate.now(), "Dolar");

            //si no hay cotizacion
            if (cotizacionDolarHoy == null) {
                throw new RuntimeException("El inmueble tiene deudas en ARS pendientes con la empresa, pero no hay cotizacion del dolar hoy. Por favor registre un cotizacion para poder realizar la rendicion del inmueble.");
            }

            //si hay cotizacion, se suma pero en realidad es una resta ya que el balance en usd es negativo
            totalPagarUSD = totalPagarUSD.add(cajaInmueble.getBalanceTotalARS().divide(cotizacionDolarHoy.getMontoCompra(), 2, BigDecimal.ROUND_HALF_UP));
        }

        //le quito el porcentaje que nos corresponde de cada reserva al total a pagar, 10%
        totalPagarUSD = totalPagarUSD.subtract(totalPagarUSD.multiply(BigDecimal.valueOf(0.1)));

        //si hay reservas para rendir
        DTOBalanceADevolver balanceADevolver = DTOBalanceADevolver.builder()
                .balanceARS(BigDecimal.ZERO)
                .balanceUSD(totalPagarUSD)
                .build();

        return balanceADevolver;
    }

    public void realizarRendicion (String identificador, DTORealizarRendicion rendicion) {

        //busco tipos de movimientos
        TipoMovimiento tipoMovimientoIngreso = tipoMovimientoRepository.findBynombreTipoMovimientoAndFechaHoraBajaTipoMovimientoIsNull("Ingreso");
        TipoMovimiento tipoMovimientoEgreso = tipoMovimientoRepository.findBynombreTipoMovimientoAndFechaHoraBajaTipoMovimientoIsNull("Egreso");

        //busco monedas
        Moneda monedaARS = monedaRepository.findBynombreMonedaAndFechaHoraBajaMonedaIsNull("Peso Argentino");
        Moneda monedaUSD = monedaRepository.findBynombreMonedaAndFechaHoraBajaMonedaIsNull("Dolar");

        //busco la caja madre
        CajaMadre cajaMadre = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull().get(0);

        //busco si es un inmueble el que hace la rendicion
        Inmueble inmuebleSeleccionado = inmuebleRepository.findByCodInmueble(identificador);

        log.info("Inmueble seleccionado: " + inmuebleSeleccionado);

        //si no es un inmueble registro la rendicion al empleado
        if (inmuebleSeleccionado == null ) {
            Empleado empleadoSeleccionado = empleadoRepository.findByDniEmpleado(identificador).get();

            //busco cataegoria movimiento
            CategoriaMovimiento categoriaMovimiento = categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Rendicion de Empleado");

            //busco la caja del empleado
            EmpleadoCaja cajaEmpleado = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoSeleccionado);



            if (rendicion.getBalanceARS().compareTo(BigDecimal.ZERO) > 0) {
                //de pesos
                //creo el movimiento de egreso de la caja del empleado
                Movimiento movimiento1 = Movimiento.builder()
                        .montoMovimiento(toDouble(rendicion.getBalanceARS()))
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .categoriaMovimiento(categoriaMovimiento)
                        .fechaMovimiento(LocalDateTime.now())
                        .tipoMovimiento(tipoMovimientoEgreso)
                        .moneda(monedaARS)
                        .empleadoCaja(cajaEmpleado)
                        .build();

                movimientoRepository.save(movimiento1);

                //creo el movimiento relaiconado a la caja madre
                Movimiento movimiento2 = Movimiento.builder()
                        .montoMovimiento(toDouble(rendicion.getBalanceARS()))
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .categoriaMovimiento(categoriaMovimiento)
                        .fechaMovimiento(LocalDateTime.now())
                        .tipoMovimiento(tipoMovimientoIngreso)
                        .moneda(monedaARS)
                        .cajaMadre(cajaMadre)
                        .build();

                movimientoRepository.save(movimiento2);

                cajaMadre.setBalanceTotalARS(rendicion.getBalanceARS().add(cajaMadre.getBalanceTotalARS()));
                cajaMadreRepository.save(cajaMadre);

                cajaEmpleado.setBalanceARS(BigDecimal.ZERO);
                empleadoCajaRepository.save(cajaEmpleado);
            }

            if (rendicion.getBalanceUSD().compareTo(BigDecimal.ZERO)>0) {
                //de dolares
                //creo el movimiento de egreso de la caja del empleado
                Movimiento movimiento1 = Movimiento.builder()
                        .montoMovimiento(toDouble(rendicion.getBalanceUSD()))
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .categoriaMovimiento(categoriaMovimiento)
                        .fechaMovimiento(LocalDateTime.now())
                        .tipoMovimiento(tipoMovimientoEgreso)
                        .moneda(monedaUSD)
                        .empleadoCaja(cajaEmpleado)
                        .build();

                movimientoRepository.save(movimiento1);

                //creo el movimiento relaiconado a la caja madre
                Movimiento movimiento2 = Movimiento.builder()
                        .montoMovimiento(toDouble(rendicion.getBalanceUSD()))
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .categoriaMovimiento(categoriaMovimiento)
                        .fechaMovimiento(LocalDateTime.now())
                        .tipoMovimiento(tipoMovimientoIngreso)
                        .moneda(monedaUSD)
                        .cajaMadre(cajaMadre)
                        .build();

                movimientoRepository.save(movimiento2);

                cajaMadre.setBalanceTotalUSD(rendicion.getBalanceUSD().add(cajaMadre.getBalanceTotalUSD()));
                cajaMadreRepository.save(cajaMadre);

                cajaEmpleado.setBalanceUSD(BigDecimal.ZERO);
                empleadoCajaRepository.save(cajaEmpleado);
            }
        }

        if (inmuebleSeleccionado != null) {

            //si el inmuebleSeleccionado no es null significa que realizo la rendicion de un inmueble

            //busco la caja del inmueble
            InmuebleCaja cajaInmueble = inmuebleCajaRepository.findByInmuebleAndFechaHoraBajaInmuebleCajaIsNull(inmuebleSeleccionado);

            log.info("Caja inmueble encontrada", cajaInmueble);

            // busco la categoria movimiento
            CategoriaMovimiento categoriaMovimiento = categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Rendicion a Inmueble");

            log.info("Categoria movimiento encontrada", categoriaMovimiento);

            log.info("balance usd:" + rendicion.getBalanceUSD());

            //creo los movimientos
            Movimiento movimiento1 = Movimiento.builder()
                    .montoMovimiento(toDouble(rendicion.getBalanceUSD()))
                    .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                    .categoriaMovimiento(categoriaMovimiento)
                    .fechaMovimiento(LocalDateTime.now())
                    .tipoMovimiento(tipoMovimientoIngreso)
                    .moneda(monedaUSD)
                    .inmuebleCaja(cajaInmueble)
                    .build();

            movimientoRepository.save(movimiento1);

            //creo el movimiento relacionado a la caja madre
            Movimiento movimiento2 = Movimiento.builder()
                    .montoMovimiento(toDouble(rendicion.getBalanceUSD()))
                    .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                    .categoriaMovimiento(categoriaMovimiento)
                    .fechaMovimiento(LocalDateTime.now())
                    .tipoMovimiento(tipoMovimientoEgreso)
                    .moneda(monedaUSD)
                    .cajaMadre(cajaMadre)
                    .build();

            movimientoRepository.save(movimiento2);

            //actualizo el balande en USD del inmueble
            cajaInmueble.setBalanceTotalUSD(rendicion.getBalanceUSD().add(cajaInmueble.getBalanceTotalUSD()));
            cajaInmueble.setBalanceTotalARS(BigDecimal.ZERO);

            inmuebleCajaRepository.save(cajaInmueble);

            //busco las reservas del inmueble que rendi

            //busco el estado que tienen que tener las reservas
            EstadoReserva estadoReserva = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");

            List<Reserva> reservasRendidas = reservaRepository.findByEstadoReservaAndRendidaAInmuebleIsFalseAndInmueble(estadoReserva, inmuebleSeleccionado);

            //las marco como rendidas
            for (Reserva reserva: reservasRendidas) {
                reserva.setRendidaAInmueble(true);
                reservaRepository.save(reserva);
            }
        }


    }
}
