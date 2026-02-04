package com.tan.seminario.backend.CasosDeUsos.Finanzas.PagoSueldos.DTOs;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOEmpleadosASeleccionar {
    private String nombreEmpleado;
    private String dniEmpleado;
    private Long sueldoEmpleado;
}
