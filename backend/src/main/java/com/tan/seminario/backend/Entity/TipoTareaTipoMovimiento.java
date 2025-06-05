package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "TipoTareaTipoMovimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class TipoTareaTipoMovimiento  extends Base {

    private LocalDateTime fechaHoraAltaTipoTareaTipoMovimiento;
    private LocalDateTime fechaHoraBajaTipoTareaTipoMovimiento;
}
