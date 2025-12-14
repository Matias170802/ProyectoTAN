package com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DTOMovimientos {
    private Double montoMovimiento;
    private LocalDateTime fechaMovimiento;
    private String tipoMovimiento;
    private String descripcionMovimiento;
    private String categoriaMovimiento;
}
