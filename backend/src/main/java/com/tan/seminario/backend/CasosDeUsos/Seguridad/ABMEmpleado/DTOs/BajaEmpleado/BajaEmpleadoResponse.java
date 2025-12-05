package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.BajaEmpleado;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class BajaEmpleadoResponse {
    private String mensaje;
    private boolean exito;
    private DatosEmpleadoDadoDeBaja empleado;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatosEmpleadoDadoDeBaja {

        private Long id;
        private String codEmpleado;
        private String nombreEmpleado;
        private String dniEmpleado;
        private LocalDateTime fechaHoraBaja;
    }
}
