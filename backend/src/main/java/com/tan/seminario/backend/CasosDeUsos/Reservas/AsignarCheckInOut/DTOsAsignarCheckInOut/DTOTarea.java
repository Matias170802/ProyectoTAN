package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DTOTarea {
    private String nombreTarea;
    private String descripcionTarea;


    private String codEmpleado;

    private String codReserva;

    private String codTipoTarea;
}
