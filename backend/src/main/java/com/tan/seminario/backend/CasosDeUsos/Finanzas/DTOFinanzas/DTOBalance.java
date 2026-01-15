package com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOBalance {
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;
}
