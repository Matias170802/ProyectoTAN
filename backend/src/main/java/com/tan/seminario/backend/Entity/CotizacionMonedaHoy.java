package com.tan.seminario.backend.Entity;


import jakarta.persistence.*;
import lombok.*;

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

    private Long montoCompra;
    private Long montoVenta;
    private LocalDate fechaCotizacionMoneda;

    @ManyToOne
    @JoinColumn(name= "idMoneda", nullable = false)
    private Moneda moneda;
}
