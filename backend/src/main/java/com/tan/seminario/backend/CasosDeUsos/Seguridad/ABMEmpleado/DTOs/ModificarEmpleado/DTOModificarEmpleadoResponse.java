package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.ModificarEmpleado;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DTOModificarEmpleadoResponse {

    private String mensaje;
    private boolean exito;
    private DatosEmpleadoModificado empleado;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatosEmpleadoModificado {
        private Long id;
        private String codEmpleado;
        private String nombreEmpleado;
        private String dniEmpleado;
        private String nroTelefonoEmpleado;
        private Long salarioEmpleado;
        private List<String> rolesActivos;
        private LocalDateTime fechaModificacion;
    }
}