package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.BajaCliente;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class DTOBajaClienteResponse {
    private String mensaje;
    private boolean exito;
    private DatosClienteDadoDeBaja cliente;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatosClienteDadoDeBaja {
        private Long id;
        private String codCliente;
        private String nombreCliente;
        private String dniCliente;
        private LocalDateTime fechaHoraBaja;
        private int inmueblesAfectados;
    }
}