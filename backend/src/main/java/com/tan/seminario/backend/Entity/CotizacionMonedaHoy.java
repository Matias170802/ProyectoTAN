package com.tan.seminario.backend.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "CotizacionMonedaHoy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class CotizacionMonedaHoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCotizacionMonedaHoy;

    private Long montoCompra;
    private Long montoVenta;
    private LocalDateTime fechaCotizacionMoneda;
}
