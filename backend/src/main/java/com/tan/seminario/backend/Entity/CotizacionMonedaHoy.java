package com.tan.seminario.backend.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/*Lombok*/
@Entity
@Table(name = "CotizacionMonedaHoy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*Lombok*/

public class CotizacionMonedaHoy extends Base{

    private BigDecimal montoCompra;
    private BigDecimal montoVenta;
    private LocalDate fechaCotizacionMoneda;

    @ManyToOne
    @JoinColumn(name= "idMoneda", nullable = false)
    private Moneda moneda;
}
