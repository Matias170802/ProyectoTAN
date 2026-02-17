package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOEmpleadosAsignados;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AMTarea.ExpertoAMTarea;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Entity.Tarea;
import com.tan.seminario.backend.Repository.ReservaRepository;
import com.tan.seminario.backend.Repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpertoAsignarCheckInOut {

    @Autowired
    private ExpertoAMTarea expertoAMTarea;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private TareaRepository tareaRepository;

    public String asignarCheckInOut (DTOTarea dtoTarea){
        try{
            String respuesta = expertoAMTarea.altaModificacionTarea(dtoTarea);
            return respuesta;
        }catch (Exception e){
            throw new RuntimeException("Fallo");
        }
    }

    public DTOEmpleadosAsignados obtenerEmpleadosYaAsignados (String codReserva) {

        //busco la reserva
        Reserva reservaEncontrada = reservaRepository.findByCodReserva(codReserva).get(0);

        //busco las traeas relacionadas a la reserva
        List<Tarea> tareasAsignadas = tareaRepository.findByReserva(reservaEncontrada);

        if(tareasAsignadas.isEmpty()) {
            //SI NO HAY TAREAS ASIGNADAS DEVUELVO NULL EN LOS NOMBRES
            return new DTOEmpleadosAsignados(null, null);
        } else {
            //SI HAY TAREAS ASIGNADAS

            //creo el dto a enviar
            DTOEmpleadosAsignados dto = new DTOEmpleadosAsignados();

           //busco el nombre de los empleados
            for (Tarea tarea: tareasAsignadas) {
                if (tarea.getTipoTarea().getCodTipoTarea().equals("TT001")) {
                //ES DE TIPO CHECK IN
                    dto.setEmpleadoAsignadoCheckIn(tarea.getEmpleado().getCodEmpleado());
                }else {
                    //ES DE TIPO CHECK OUT

                    dto.setEmpleadoAsignadoCheckOut(tarea.getEmpleado().getCodEmpleado());
                }
            }

            return dto;
        }
    }

}
