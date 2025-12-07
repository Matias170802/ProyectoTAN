package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOCambioMoneda {
    private String tipoCambio;
    private BigDecimal montoAConvertir;
}
