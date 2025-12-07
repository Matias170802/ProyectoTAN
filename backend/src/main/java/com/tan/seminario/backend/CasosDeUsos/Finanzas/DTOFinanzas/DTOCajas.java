package com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOCajas {
    private String nombre;
    private String tipo;
    private LocalDateTime ultimoMovimiento;
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;
}
