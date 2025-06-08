package com.tan.seminario.backend.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "CategoriaMovimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class CategoriaMovimiento extends Base {


    @Column (unique = true)
    private String codCategoriaMovimiento;

    @Column (unique = true)
    private String nombreCategoriaMovimiento;

    private LocalDateTime fechaHoraAltaCategoriaMovimiento;
    private LocalDateTime fechaHoraBajaCategoriaMovimiento;
}
