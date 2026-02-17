package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOEmpleadosAsignados {
    private String nombreEmpleadoAsignadoCheckIn;
    private String nombreEmpleadoAsignadoCheckOut;
}
