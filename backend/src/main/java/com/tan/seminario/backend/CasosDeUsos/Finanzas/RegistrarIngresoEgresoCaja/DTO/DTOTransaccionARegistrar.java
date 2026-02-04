package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOTransaccionARegistrar {

    private String tipoTransaccion;
    private String categoria;
    private String moneda;
    private Double monto;
    private String descripcion;
}
