package com.tan.seminario.backend.CasosDeUsos.Inicio;

import com.tan.seminario.backend.CasosDeUsos.Inicio.DTOInicio.DTOTarea;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.springframework.stereotype.Service;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@Service
public class ExpertoInicio {

    private final InmuebleRepository inmuebleRepository;
    private final TareaRepository tareaRepository;

    public ExpertoInicio(InmuebleRepository inmuebleRepository, TareaRepository tareaRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.tareaRepository = tareaRepository;
    }

    public List<DTOTarea> buscarTareas() {
        return null;
    }
}
