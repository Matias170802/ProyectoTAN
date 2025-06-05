package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Moneda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Moneda  extends Base {

    private Long idMoneda;

    @Column(unique = true)
    private String codMoneda;

    @Column(unique = true)
    private String nombreMoneda;

    private LocalDateTime fechaHoraAltaMoneda;
    private LocalDateTime fechaHoraBajaMoneda;

}
