package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "EmpleadoRol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class EmpleadoRol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleadoRol;

    private LocalDateTime fechaHoraAltaEmpleadoRol;
    private LocalDateTime fechaHoraBajaEmpleadoRol;
}
