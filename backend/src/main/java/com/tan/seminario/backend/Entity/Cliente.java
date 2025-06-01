package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @Column (unique = true)
    private String dniCliente;

    @Column (unique = true)
    private String codCliente;

    private String nombreCliente;
    private LocalDateTime fechaHoraBajaCliente;
    private LocalDateTime fechaHoraAltaCliente;
}
