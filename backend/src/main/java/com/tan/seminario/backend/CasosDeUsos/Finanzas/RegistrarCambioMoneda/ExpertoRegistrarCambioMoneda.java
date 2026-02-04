package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCambioMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoRegistrarCambioMoneda {

    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;
    private final CajaMadreRepository cajaMadreRepository;
    private final MovimientoRepository movimientoRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final MonedaRepository monedaRepository;

    public ExpertoRegistrarCambioMoneda(CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository, CajaMadreRepository cajaMadreRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, MovimientoRepository movimientoRepository, TipoMovimientoRepository tipoMovimientoRepository, MonedaRepository monedaRepository)  {
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
        this.cajaMadreRepository = cajaMadreRepository;
        this.movimientoRepository = movimientoRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.monedaRepository = monedaRepository;
    }

    public DTOCotizacionMonedaHoy buscarCotizacionMonedaHoy(String tipoCambio) {

        if (tipoCambio.equals("dolaresAPesos") || tipoCambio.equals("pesosADolares")) {

            LocalDate fechaActual = LocalDate.now();
            CotizacionMonedaHoy cotizacionAUtilizar = cotizacionMonedaHoyRepository.findByFechaCotizacionMonedaAndMoneda_NombreMoneda(fechaActual, "Dolar");

            if (cotizacionAUtilizar != null) {
                return DTOCotizacionMonedaHoy.builder()
                        .montoCompra(cotizacionAUtilizar.getMontoCompra())
                        .montoVenta(cotizacionAUtilizar.getMontoVenta())
                        .build();
            } else {
                throw new RuntimeException("No existe una cotizacion para el dia de hoy para la moneda dolar, por favor registre una cotizacion para la moneda dolar antes de realizar el cambio de moneda.");
            }
        }
        // Si el tipoCambio NO es válido
        throw new RuntimeException("Tipo de cambio inválido. Debe ser 'dolaresAPesos' o 'pesosADolares'.");
    }

    public List<CajaMadre> registrarCambioMoneda (DTOCambioMoneda cambioMoneda) {
        List<CajaMadre> cajaMadreAModificar = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull();
        CotizacionMonedaHoy cotizacionAUtilizar = cotizacionMonedaHoyRepository.findByFechaCotizacionMonedaAndMoneda_NombreMoneda(LocalDate.now(), "Dolar");

        if (cambioMoneda.getTipoCambio().equals("dolaresAPesos")) {
            //el valor que me viene de cambioMoneda.MontoAConvertir es en dolares
            for (CajaMadre cajaMadre: cajaMadreAModificar) {
                BigDecimal balanceARSActual = cajaMadre.getBalanceTotalARS();
                BigDecimal nuevoBalanceARS = balanceARSActual.add(cambioMoneda.getMontoAConvertir().multiply(cotizacionAUtilizar.getMontoVenta()));

                BigDecimal nuevoBalanceUSD = cajaMadre.getBalanceTotalUSD().subtract(cambioMoneda.getMontoAConvertir());

                cajaMadre.setBalanceTotalARS(nuevoBalanceARS);
                cajaMadre.setBalanceTotalUSD(nuevoBalanceUSD);

                //creo los movimientos en la caja madre

                //MOVIMIENTO 1: egreso de dolares
                Movimiento movimientoEgreso = Movimiento.builder()
                        .tipoMovimiento(tipoMovimientoRepository.findBynombreTipoMovimiento("Egreso"))
                        .fechaMovimiento(LocalDateTime.now())
                        .categoriaMovimiento(categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Cambio Moneda"))
                        .moneda(monedaRepository.findBynombreMoneda("Dolar"))
                        .cajaMadre(cajaMadre)
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .montoMovimiento(cambioMoneda.getMontoAConvertir().doubleValue())
                        .build();

                movimientoRepository.save(movimientoEgreso);

                //MOVIMIENTO 2: ingreso de pesos argentinos
                Movimiento movimientoIngreso = Movimiento.builder()
                        .tipoMovimiento(tipoMovimientoRepository.findBynombreTipoMovimiento("Ingreso"))
                        .fechaMovimiento(LocalDateTime.now())
                        .categoriaMovimiento(categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Cambio Moneda"))
                        .moneda(monedaRepository.findBynombreMoneda("Peso Argentino"))
                        .cajaMadre(cajaMadre)
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .montoMovimiento(cambioMoneda.getMontoAConvertir().multiply(cotizacionAUtilizar.getMontoVenta()).doubleValue())
                        .build();

                movimientoRepository.save(movimientoIngreso);
            }
        } else {
            //el valor que me viene en cambioMoneda.MontoAConvertir es en pesos
            for (CajaMadre cajaMadre: cajaMadreAModificar) {
                BigDecimal balanceARSActual = cajaMadre.getBalanceTotalARS();
                BigDecimal nuevoBalanceARS = balanceARSActual.subtract(cambioMoneda.getMontoAConvertir());

                BigDecimal nuevoBalanceUSD = cajaMadre.getBalanceTotalUSD().add(cambioMoneda.getMontoAConvertir().divide(cotizacionAUtilizar.getMontoCompra(), 2,  RoundingMode.HALF_UP));

                cajaMadre.setBalanceTotalARS(nuevoBalanceARS);
                cajaMadre.setBalanceTotalUSD(nuevoBalanceUSD);

                //creo los movimientos en la caja madre

                //MOVIMIENTO 1: egreso de pesos argentinos
                Movimiento movimientoEgreso = Movimiento.builder()
                        .tipoMovimiento(tipoMovimientoRepository.findBynombreTipoMovimiento("Egreso"))
                        .fechaMovimiento(LocalDateTime.now())
                        .categoriaMovimiento(categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Cambio Moneda"))
                        .moneda(monedaRepository.findBynombreMoneda("Peso Argentino"))
                        .cajaMadre(cajaMadre)
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .montoMovimiento(cambioMoneda.getMontoAConvertir().doubleValue())
                        .build();

                movimientoRepository.save(movimientoEgreso);

                //MOVIMIENTO 2: ingreso de dolares
                Movimiento movimientoIngreso = Movimiento.builder()
                        .tipoMovimiento(tipoMovimientoRepository.findBynombreTipoMovimiento("Ingreso"))
                        .fechaMovimiento(LocalDateTime.now())
                        .categoriaMovimiento(categoriaMovimientoRepository.findBynombreCategoriaMovimientoAndFechaHoraBajaCategoriaMovimientoIsNull("Cambio Moneda"))
                        .moneda(monedaRepository.findBynombreMoneda("Dolar"))
                        .cajaMadre(cajaMadre)
                        .nroMovimiento(Movimiento.generarProximoNumero(movimientoRepository))
                        .montoMovimiento(cambioMoneda.getMontoAConvertir().divide(cotizacionAUtilizar.getMontoCompra(), 2,  RoundingMode.HALF_UP).doubleValue())
                        .build();

                movimientoRepository.save(movimientoIngreso);
            }
        }

        cajaMadreRepository.saveAll(cajaMadreAModificar);

        return cajaMadreAModificar;
    }
}
