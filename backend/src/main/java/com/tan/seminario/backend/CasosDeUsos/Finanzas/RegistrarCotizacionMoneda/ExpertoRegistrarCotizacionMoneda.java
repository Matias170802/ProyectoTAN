package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda.DTO.DTOMonedas;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda.DTO.DTOCotizacionMoneda;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.Moneda;
import com.tan.seminario.backend.Repository.CotizacionMonedaHoyRepository;
import com.tan.seminario.backend.Repository.MonedaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoRegistrarCotizacionMoneda {

    private final MonedaRepository monedaRepository;
    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;
    private static final Logger log = LoggerFactory.getLogger(ExpertoRegistrarCotizacionMoneda.class);



    public ExpertoRegistrarCotizacionMoneda(MonedaRepository monedaRepository, CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository, RestClient.Builder builder) {
        this.monedaRepository = monedaRepository;
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
    }

    public CotizacionMonedaHoy registrarCotizacionMoneda(DTOCotizacionMoneda cotizacion ){
        Moneda monedaSeleccionada = monedaRepository.findBynombreMoneda(cotizacion.nombreMoneda);
        if (monedaSeleccionada == null) {
            throw new RuntimeException("Moneda no encontrada");
        }

        List<CotizacionMonedaHoy> cotizacionesExistentes = cotizacionMonedaHoyRepository.findByFechaCotizacionMoneda(LocalDate.now());

        if (!cotizacionesExistentes.isEmpty()) {
            for (CotizacionMonedaHoy cotizacionExistente : cotizacionesExistentes) {
                if (cotizacionExistente.getMoneda().getCodMoneda().equals(monedaSeleccionada.getCodMoneda())) {
                    throw new RuntimeException("ya existe una cotizacion para el dia de hoy");
                }
            }
        }


        CotizacionMonedaHoy nuevaCotizacion = CotizacionMonedaHoy.builder()
                .fechaCotizacionMoneda(LocalDate.now())
                .montoCompra(cotizacion.montoCompra)
                .montoVenta(cotizacion.montoVenta)
                .moneda(monedaSeleccionada)
                .build();

        cotizacionMonedaHoyRepository.save(nuevaCotizacion);

        return nuevaCotizacion;
    }

    public List<DTOMonedas> buscarMonedas () {
        Moneda moneda = monedaRepository.findBynombreMoneda("Dolar");
        List<DTOMonedas> monedasAEnviar = new ArrayList<>();

        //creo el dto
        DTOMonedas dto = new DTOMonedas();

        //seteo el dto
        dto.setNombreMoneda(moneda.getNombreMoneda());

        monedasAEnviar.add(dto);

        return monedasAEnviar;
    }
}
