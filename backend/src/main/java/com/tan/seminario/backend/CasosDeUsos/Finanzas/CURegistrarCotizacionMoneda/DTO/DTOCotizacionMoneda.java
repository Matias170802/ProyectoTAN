package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DTOCotizacionMoneda {
    public String nombreMoneda;
    public Long montoCompra;
    public Long montoVenta;
}
