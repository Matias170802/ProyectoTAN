package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import com.tan.seminario.backend.Repository.CotizacionMonedaHoyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ExpertoRegistrarCambioMoneda {

    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;

    public ExpertoRegistrarCambioMoneda(CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository) {
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
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
}
