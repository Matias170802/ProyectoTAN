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

public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleado;

    @Column(unique = true)
    private String dniEmpleado;

    @Column (unique = true)
    private String codEmpleado;

    private String nombreEmpleado;
    private String nroTelefonoEmpleado;
    private Long salarioEmpleado;
    private LocalDateTime fechaHoraBajaEmpleado;
    private LocalDateTime fechaHoraAltaEmpleado;
    private LocalDateTime fechaUltimoCobroSalario;

}

