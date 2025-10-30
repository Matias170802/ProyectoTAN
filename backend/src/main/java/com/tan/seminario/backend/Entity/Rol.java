package com.tan.seminario.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Rol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Rol  extends Base{

    private Long idRol;

    @Column(unique = true)
    private String codRol;

    @Column (unique = true)
    private String nombreRol;

    @Column
    private LocalDateTime fechaHoraBajaRol;

    @Column
    private LocalDateTime fechaHoraAltaRol;
}
