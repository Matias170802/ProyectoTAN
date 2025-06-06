package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "TipoMovimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class TipoMovimiento  extends Base {

    @Column (unique = true)
    private String codTipoMovimiento;

    @Column (unique = true)
    private String nombreTipoMovimiento;

    private LocalDateTime fechaHoraAltaTipoMovimiento;

    private LocalDateTime fechaHoraBajaTipoMovimiento;
}
