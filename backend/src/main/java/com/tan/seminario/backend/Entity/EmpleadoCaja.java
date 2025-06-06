package com.tan.seminario.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/*Lombok*/
@Entity
@Table(name = "EmpleadoCaja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoCaja extends Base {

    @Column(unique = true)
    private Long nroEmpleadoCaja;
  
    private String nombreEmpleadoCaja;
    private BigDecimal balanceARS;
    private BigDecimal balanceUSD;

}