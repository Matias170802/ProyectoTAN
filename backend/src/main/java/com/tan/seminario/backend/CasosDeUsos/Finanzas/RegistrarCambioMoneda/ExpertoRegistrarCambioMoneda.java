package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCambioMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import com.tan.seminario.backend.Repository.CajaMadreRepository;
import com.tan.seminario.backend.Repository.CotizacionMonedaHoyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpertoRegistrarCambioMoneda {

    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;
    private final CajaMadreRepository cajaMadreRepository;

    public ExpertoRegistrarCambioMoneda(CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository, CajaMadreRepository cajaMadreRepository) {
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
        this.cajaMadreRepository = cajaMadreRepository;
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
                BigDecimal nuevoBalanceARS = balanceARSActual.add(cambioMoneda.getMontoAConvertir().multiply(cotizacionAUtilizar.getMontoCompra()));

                BigDecimal nuevoBalanceUSD = cajaMadre.getBalanceTotalUSD().subtract(cambioMoneda.getMontoAConvertir());

                cajaMadre.setBalanceTotalARS(nuevoBalanceARS);
                cajaMadre.setBalanceTotalUSD(nuevoBalanceUSD);
            }
        } else {
            //el valor que me viene en cambioMoneda.MontoAConvertir es en pesos
            for (CajaMadre cajaMadre: cajaMadreAModificar) {
                BigDecimal balanceARSActual = cajaMadre.getBalanceTotalARS();
                BigDecimal nuevoBalanceARS = balanceARSActual.subtract(cambioMoneda.getMontoAConvertir());

                BigDecimal nuevoBalanceUSD = cajaMadre.getBalanceTotalUSD().add(cambioMoneda.getMontoAConvertir().divide(cotizacionAUtilizar.getMontoCompra()));

                cajaMadre.setBalanceTotalARS(nuevoBalanceARS);
                cajaMadre.setBalanceTotalUSD(nuevoBalanceUSD);
            }
        }

        cajaMadreRepository.saveAll(cajaMadreAModificar);

        return cajaMadreAModificar;
    }
}
