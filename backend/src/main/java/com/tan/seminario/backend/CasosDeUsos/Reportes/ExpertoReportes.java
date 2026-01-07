package com.tan.seminario.backend.CasosDeUsos.Reportes;

import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.DTOInmueblesFiltro;
import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.DTOReportesFinanzas;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpertoReportes {

    private final InmuebleRepository inmuebleRepository;

    public ExpertoReportes(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }


    // reportes de gerencia
    public List<DTOInmueblesFiltro> obtenerInmueblesFiltro() {
        List<Inmueble> inmueblesActivos = inmuebleRepository.findByFechaHoraBajaInmuebleIsNull();

        List <DTOInmueblesFiltro> dtos = new java.util.ArrayList<>();

        for (Inmueble inmueble: inmueblesActivos) {
            DTOInmueblesFiltro dto = DTOInmueblesFiltro.builder()
                    .codInmueble(inmueble.getCodInmueble())
                    .nombreInmueble(inmueble.getNombreInmueble())
                    .build();

            dtos.add(dto);
        }

        //en el caso de que no hayan inmuebles disponibles
        if (dtos.isEmpty()) {
            throw new RuntimeException("No hay inmuebles disponibles");
        }

        return dtos;
    }

    // reportes de gerencia

    // reportes financieros

    public DTOReportesFinanzas obtenerEstadisticasFinancieras(String anio, String mes) {
        //TODO: HACER UN SWITCH CASE PARA CADA CASO, O VER QUE HACER, BUSCAR RESERVAS EN EL PERIODO INDICADO Y DE AHI SACAS EL PORCENTAJE QUE SE INDICA, PARA OBTENER LAS GANANCIAS
        //switch ()
        return null;
    }
    // reportes financieros

}
