package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AMTarea.ExpertoAMTarea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpertoAsignarCheckInOut {

    @Autowired
    private ExpertoAMTarea expertoAMTarea;

    public String asignarCheckInOut (DTOTarea dtoTarea){
        try{
            String respuesta = expertoAMTarea.altaModificacionTarea(dtoTarea);
            return respuesta;
        }catch (Exception e){
            throw new RuntimeException("Fallo");
        }
    }

}
