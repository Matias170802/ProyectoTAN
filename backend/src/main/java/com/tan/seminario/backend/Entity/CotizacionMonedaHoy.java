package com.tan.seminario.backend.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "CotizacionMonedaHoy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*Lombok*/

public class CotizacionMonedaHoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCotizacionMonedaHoy;

    private Long montoCompra;
    private Long montoVenta;
    private LocalDateTime fechaCotizacionMoneda;

    @ManyToOne
    @JoinColumn(name= "idMoneda", nullable = false)
    private Moneda moneda;
}
