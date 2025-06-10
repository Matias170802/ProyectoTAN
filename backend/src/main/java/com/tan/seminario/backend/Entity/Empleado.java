package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Empleado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Empleado extends Base {

    private Long idEmpleado;

    @Column (unique = true, nullable = false)
    private String dniEmpleado;

    @Column (unique = true, nullable = false)
    private String codEmpleado;

    @Column
    private String nombreEmpleado;

    @Column
    private String nroTelefonoEmpleado;

    @Column
    private Long salarioEmpleado;

    @Column
    private LocalDateTime fechaHoraBajaEmpleado;

    @Column (unique = true, nullable = false)
    private LocalDateTime fechaHoraAltaEmpleado;

    @Column
    private LocalDateTime fechaUltimoCobroSalario;

}

