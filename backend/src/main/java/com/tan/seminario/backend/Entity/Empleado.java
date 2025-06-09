package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/*Lombok*/
@Entity
@Table(name = "Empleado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*Lombok*/

public class Empleado  extends Base {

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

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL)
    private List<EmpleadoRol> empleadosRoles = new ArrayList<>();

}