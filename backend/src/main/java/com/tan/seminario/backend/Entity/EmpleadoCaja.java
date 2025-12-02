package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "EmpleadoCaja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpleadoCaja  extends Base {

    @Column(unique = true)
    private Long nroEmpleadoCaja;

    private String nombreEmpleadoCaja;
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;
    private LocalDateTime fechaHoraAltaEmpleadoCaja;
    private LocalDateTime fechaHoraBajaEmpleadoCaja;

    @OneToOne
    @JoinColumn(name = "idEmpleado", nullable = false)
    private Empleado empleado;
}