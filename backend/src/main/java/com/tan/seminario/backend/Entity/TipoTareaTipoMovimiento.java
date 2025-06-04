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

public class TipoTareaTipoMovimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoTareaTipoMovimiento;

    private LocalDateTime fechaHoraAltaTipoTareaTipoMovimiento;
    private LocalDateTime fechaHoraBajaTipoTareaTipoMovimiento;

    @ManyToOne
    @JoinColumn(name = "idTipoTarea", nullable = false)
    private TipoTarea tipoTarea;

    @ManyToOne
    @JoinColumn(name = "idTipoMovimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;
}
