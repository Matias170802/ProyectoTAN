package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Movimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Movimiento  extends Base {

    private Long nroMovimiento;

    private String descripcionMovimiento;
    private Double montoMovimiento;
    private LocalDateTime fechaMovimiento;
}
