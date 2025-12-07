package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOTareasARealizar {

    private String nombreTarea;
    private LocalDateTime fechayHoraTarea;
    private String ubicacionTarea;
    private String tipoTarea;
    private String descripcionTarea;
}
