package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCotizacionMoneda.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DTOCotizacionMoneda {
    public String nombreMoneda;
    public BigDecimal montoCompra;
    public BigDecimal montoVenta;
}
