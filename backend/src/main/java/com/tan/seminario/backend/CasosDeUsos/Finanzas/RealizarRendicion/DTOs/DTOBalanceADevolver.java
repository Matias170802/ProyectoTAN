package com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOBalanceADevolver {
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;
}
