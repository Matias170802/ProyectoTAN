package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble;

import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoInmueble {
    private final InmuebleRepository inmuebleRepository;

    public ExpertoInmueble(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }

    public List<DTOInmueble> obtenerInmuebles() {
        List<Inmueble> inmuebles = inmuebleRepository.findAll();
        List<DTOInmueble> dtos = new ArrayList<>();
        for (Inmueble in : inmuebles) {
            DTOInmueble dto = new DTOInmueble();
            dto.setCodInmueble(in.getCodInmueble());
            dto.setNombreInmueble(in.getNombreInmueble());
            dto.setCapacidad(in.getCapacidad());
            dto.setPrecioPorNocheUSD(in.getPrecioPorNocheUSD());
            dtos.add(dto);
        }
        return dtos;
    }
}
