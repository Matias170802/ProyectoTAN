package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "InmuebleCaja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/


public class InmuebleCaja  extends Base{

    @Column (unique = true)
    private Long nroInmuebleCaja;
   
    private String nombreInmuebleCaja;
    private BigDecimal balanceTotalARS;
    private BigDecimal balanceTotalUSD;
    private LocalDateTime fechaHoraAltaInmuebleCaja;
    private LocalDateTime fechaHoraBajaInmuebleCaja;

    @OneToOne
    @JoinColumn(name = "idInmueble", nullable = false)
    private Inmueble inmueble;
}
