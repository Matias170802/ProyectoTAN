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
@Table(name = "EmpleadoCaja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class EmpleadoCaja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleadoCaja;

    @Column (unique = true)
    private Long nroEmpleadoCaja;

    @Column(unique = true)
    private String nombreEmpleadoCaja;

    private BigDecimal balanceTotalARS;
    private BigDecimal balanceTotalUSD;
    private LocalDateTime fechaHoraAltaEmpleadoCaja;
    private LocalDateTime fechaHoraBajaEmpleadoCaja;
}
