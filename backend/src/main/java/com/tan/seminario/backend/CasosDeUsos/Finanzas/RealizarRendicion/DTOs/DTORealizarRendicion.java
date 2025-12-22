package com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTORealizarRendicion {
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;
}
