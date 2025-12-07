package com.tan.seminario.backend.CasosDeUsos.Inicio.DTOInicio;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder

public class DTOTarea {
    private String nombreTarea;
    private String descripcionTarea;
    private String ubicacionTarea;
    private String tipoTarea;
    private String fechaYHoraTarea;
}
