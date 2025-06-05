package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "TipoTarea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class TipoTarea  extends Base {

    @Column (unique = true)
    private String codTipoTarea;

    @Column (unique = true)
    private String nombreTipoTarea;

    private LocalDateTime fechaHoraAltaTipoTarea;
    private LocalDateTime fechaHoraBajaTipoTarea;
}
