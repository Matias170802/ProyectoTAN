package com.tan.seminario.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "CajaMadre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/
public class CajaMadre extends Base {

    private Long nroCajaMadre;

    @Column(unique = true)
    private String nombreCajaMadre;

    @Column
    private BigDecimal balanceTotalARS;

    @Column
    private BigDecimal balanceTotalUSD;

    @Column
    private LocalDateTime fechaHoraAltaCajaMadre;

    @Column
    private LocalDateTime fechaHoraBajaCajaMadre;

}