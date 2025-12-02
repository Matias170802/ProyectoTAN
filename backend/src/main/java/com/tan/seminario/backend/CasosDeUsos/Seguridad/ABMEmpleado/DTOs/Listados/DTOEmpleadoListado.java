package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.Listados;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DTOEmpleadoListado {

    private Long id;
    private String codEmpleado;
    private String nombreEmpleado;
    private String dniEmpleado;
    private List<String> codigosRoles;
    private List<String> nombresRoles;
    private BigDecimal balanceCajaARS;
    private BigDecimal balanceCajaUSD;
    private boolean activo;
}