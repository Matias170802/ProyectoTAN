package com.tan.seminario.backend.DTOGenerales;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DTOErrorResponse {
    private String mensaje;
    private int codigo;
}