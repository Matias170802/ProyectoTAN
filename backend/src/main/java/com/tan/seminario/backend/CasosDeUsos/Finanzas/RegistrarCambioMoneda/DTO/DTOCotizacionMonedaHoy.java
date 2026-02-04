package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOCotizacionMonedaHoy {
    private BigDecimal montoVenta;
    private BigDecimal montoCompra;

}
