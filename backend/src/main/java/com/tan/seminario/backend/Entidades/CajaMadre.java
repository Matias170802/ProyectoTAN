package com.tan.seminario.backend.Entidades;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "CajaMadre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CajaMadre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nroCajaMadre;

    @Column (unique = true)
    private String nombre;

    private BigDecimal balanceTotalARS;
    private BigDecimal balanceTotalUSD;

    private LocalDateTime fechaHoraAltaCajaMadre;
    
    private LocalDateTime fechaHoraBajaCajaMadre;



}
