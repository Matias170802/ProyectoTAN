package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO.DTOMonedas;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO.DTOCotizacionMoneda;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import com.tan.seminario.backend.Entity.Moneda;
import com.tan.seminario.backend.Repository.CotizacionMonedaHoyRepository;
import com.tan.seminario.backend.Repository.MonedaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoRegistrarCotizacionMoneda {

    private final MonedaRepository monedaRepository;
    private final CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository;
    private final RestClient.Builder builder;


    public ExpertoRegistrarCotizacionMoneda(MonedaRepository monedaRepository, CotizacionMonedaHoyRepository cotizacionMonedaHoyRepository, RestClient.Builder builder) {
        this.monedaRepository = monedaRepository;
        this.cotizacionMonedaHoyRepository = cotizacionMonedaHoyRepository;
        this.builder = builder;
    }

    public CotizacionMonedaHoy registrarCotizacionMoneda(DTOCotizacionMoneda cotizacion ){
        Moneda monedaSeleccionada = monedaRepository.findByNombreMoneda(cotizacion.nombreMoneda);

        if (monedaSeleccionada == null) {
            throw new RuntimeException("Moneda no encontrada");
        }

        CotizacionMonedaHoy nuevaCotizacion = CotizacionMonedaHoy.builder()
                .fechaCotizacionMoneda(LocalDateTime.now())
                .montoCompra(cotizacion.montoCompra)
                .montoVenta(cotizacion.montoVenta)
                .moneda(monedaSeleccionada)
                .build();

        cotizacionMonedaHoyRepository.save(nuevaCotizacion);

        return nuevaCotizacion;
    }

    public List<DTOMonedas> buscarMonedas () {
        List<Moneda> monedas = monedaRepository.findByfechaHoraBajaMonedaIsNull();
        List<DTOMonedas> monedasAEnviar = new ArrayList<>();

        for (Moneda moneda : monedas) {
            DTOMonedas dto = new DTOMonedas();
            dto.setNombreMoneda(moneda.getNombreMoneda());
            monedasAEnviar.add(dto);
        }

        return monedasAEnviar;
    }
}
