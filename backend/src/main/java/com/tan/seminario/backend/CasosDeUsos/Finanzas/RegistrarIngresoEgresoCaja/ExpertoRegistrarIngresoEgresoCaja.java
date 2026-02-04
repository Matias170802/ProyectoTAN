package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.*;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertoRegistrarIngresoEgresoCaja {
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final MonedaRepository monedaRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final MovimientoRepository movimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final Logger logger = org.slf4j.LoggerFactory.getLogger(ExpertoRegistrarIngresoEgresoCaja.class);

    public ExpertoRegistrarIngresoEgresoCaja(TipoMovimientoRepository tipoMovimientoRepository, MonedaRepository monedaRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, MovimientoRepository movimientoRepository, UsuarioRepository usuarioRepository, EmpleadoCajaRepository empleadoCajaRepository)  {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.monedaRepository = monedaRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.movimientoRepository = movimientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
    }

    public List<DTOTipoTransaccion> buscarTiposTransaccion() {
        List<TipoMovimiento> tiposMovimientosExistentes = tipoMovimientoRepository.findByfechaHoraBajaTipoMovimientoIsNull();
        List<DTOTipoTransaccion> tiposTransaccionAEnviar = new java.util.ArrayList<>();

        for (TipoMovimiento tipoMovimiento: tiposMovimientosExistentes) {
            DTOTipoTransaccion dto = DTOTipoTransaccion.builder()
                    .nombreTipoTransaccion(tipoMovimiento.getNombreTipoMovimiento())
                    .build();
            tiposTransaccionAEnviar.add(dto);
        }

        return tiposTransaccionAEnviar;
    }

    public List<DTOMoneda> buscarTiposMoneda() {
        List<Moneda> monedasExistentes = monedaRepository.findByfechaHoraBajaMonedaIsNull();
        List<DTOMoneda> monedasAEnviar = new java.util.ArrayList<>();

        for (Moneda moneda: monedasExistentes) {
            DTOMoneda dto = DTOMoneda.builder()
                    .nombreMoneda(moneda.getNombreMoneda())
                    .build();
            monedasAEnviar.add(dto);
        }
        return monedasAEnviar;
    }

    public List<DTOCategoriaMovimiento> buscarCategoriasMovimiento () {
        List<CategoriaMovimiento> categoriaMovimientoExistentes = categoriaMovimientoRepository.findByFechaHoraBajaCategoriaMovimientoIsNull();
        List<DTOCategoriaMovimiento> categoriaMovimientoAEnviar = new java.util.ArrayList<>();

        //solo mando las ctaegorias de seña, cancelacion reserva y otros
        for (CategoriaMovimiento categoriaMovimiento : categoriaMovimientoExistentes) {
            if (categoriaMovimiento.getNombreCategoriaMovimiento().equals("Otros") || categoriaMovimiento.getNombreCategoriaMovimiento().equals("Cancelacion Reserva")) {
                DTOCategoriaMovimiento dto = DTOCategoriaMovimiento.builder()
                        .nombreCategoria(categoriaMovimiento.getNombreCategoriaMovimiento())
                        .build();

                categoriaMovimientoAEnviar.add(dto);
            }
        }

        return categoriaMovimientoAEnviar;
    }

    public DTOMovimiento registrarMovimiento (DTOTransaccionARegistrar transaccionARegistrar, String username) {
        Moneda monedaSeleccionada = monedaRepository.findBynombreMoneda(transaccionARegistrar.getMoneda());
        TipoMovimiento tipoMovimientoSeleccionado = tipoMovimientoRepository.findBynombreTipoMovimiento(transaccionARegistrar.getTipoTransaccion());
        CategoriaMovimiento categoriaMovimientoSeleccionada = categoriaMovimientoRepository.findBynombreCategoriaMovimiento(transaccionARegistrar.getCategoria());
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();

        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        EmpleadoCaja cajaEmpleadoActivo = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoActivo);

        logger.info("Monto movimiento" + transaccionARegistrar.getMonto());
        Movimiento nuevoMovimiento = Movimiento.builder()
                .moneda(monedaSeleccionada)
                .descripcionMovimiento(transaccionARegistrar.getDescripcion())
                .montoMovimiento(transaccionARegistrar.getMonto())
                .fechaMovimiento(LocalDateTime.now())
                .categoriaMovimiento(categoriaMovimientoSeleccionada)
                .tipoMovimiento(tipoMovimientoSeleccionado)
                .empleadoCaja(cajaEmpleadoActivo)
                .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                .build();

        //guardo en la base de datos el nuevo movimiento
        movimientoRepository.save(nuevoMovimiento);

        if (tipoMovimientoSeleccionado.getNombreTipoMovimiento().equals("Ingreso")) {
            if (monedaSeleccionada.getNombreMoneda().equals("Peso Argentino")) {
                //modifico el balance de la caja del empleado
                BigDecimal balanceAntiguo = cajaEmpleadoActivo.getBalanceARS();
                cajaEmpleadoActivo.setBalanceARS(balanceAntiguo.add(BigDecimal.valueOf(transaccionARegistrar.getMonto())));
            } else {
                BigDecimal balanceAntiguo = cajaEmpleadoActivo.getBalanceUSD();
                cajaEmpleadoActivo.setBalanceUSD(balanceAntiguo.add(BigDecimal.valueOf(transaccionARegistrar.getMonto())));
            }
        } else if (tipoMovimientoSeleccionado.getNombreTipoMovimiento().equals("Egreso")) {
            if (monedaSeleccionada.getNombreMoneda().equals("Peso Argentino")) {
                //modifico el balance de la caja del empleado
                BigDecimal balanceAntiguo = cajaEmpleadoActivo.getBalanceARS();
                cajaEmpleadoActivo.setBalanceARS(balanceAntiguo.subtract(BigDecimal.valueOf(transaccionARegistrar.getMonto())));
            } else {
                BigDecimal balanceAntiguo = cajaEmpleadoActivo.getBalanceUSD();
                cajaEmpleadoActivo.setBalanceUSD(balanceAntiguo.subtract(BigDecimal.valueOf(transaccionARegistrar.getMonto())));
            }
        }

        //guardo lo cambiado en la caja del empleado
        empleadoCajaRepository.save(cajaEmpleadoActivo);

        //creo DTOMovimiento para poder transferir datos
        DTOMovimiento dto = DTOMovimiento.builder()
                .nroMovimiento(nuevoMovimiento.getNroMovimiento())

                .nroCajaMadre(
                        nuevoMovimiento.getCajaMadre() != null
                                ? nuevoMovimiento.getCajaMadre().getNroCajaMadre()
                                : 0
                )

                .descripcionMovimiento(nuevoMovimiento.getDescripcionMovimiento())

                .nroTarea(
                        nuevoMovimiento.getTarea() != null
                                ? nuevoMovimiento.getTarea().getNroTarea()
                                : 0
                )

                .nroInmuebleCaja(
                        nuevoMovimiento.getInmuebleCaja() != null
                                ? nuevoMovimiento.getInmuebleCaja().getNroInmuebleCaja()
                                : 0
                )

                .codReserva(
                        nuevoMovimiento.getReserva() != null
                                ? nuevoMovimiento.getReserva().getCodReserva()
                                : ""
                )

                .codCategoriaMovimiento(nuevoMovimiento.getCategoriaMovimiento().getCodCategoriaMovimiento())
                .nroEmpleadoCaja(nuevoMovimiento.getEmpleadoCaja().getNroEmpleadoCaja())
                .fechaMovimiento(nuevoMovimiento.getFechaMovimiento())
                .codMoneda(nuevoMovimiento.getMoneda().getCodMoneda())
                .montoMovimiento(nuevoMovimiento.getMontoMovimiento())
                .codTipoMovimiento(nuevoMovimiento.getTipoMovimiento().getCodTipoMovimiento())
                .build();

        return dto;
    }
}
