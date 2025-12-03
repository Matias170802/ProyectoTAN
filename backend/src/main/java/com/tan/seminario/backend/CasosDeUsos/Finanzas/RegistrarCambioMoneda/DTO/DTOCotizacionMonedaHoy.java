package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOCotizacionMonedaHoy {
    private Long montoVenta;
    private Long montoCompra;

}
