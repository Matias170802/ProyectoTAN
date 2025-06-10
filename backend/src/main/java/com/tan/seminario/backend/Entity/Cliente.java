package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

/*Lombok*/
@Entity
@Table(name = "Cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Cliente extends Base {

    @Column (unique = true)
    private String codCliente;

    @Column (unique = true)
    private String dniCliente;

    @Column
    private String nombreCliente;

    @Column
    private LocalDateTime fechaHoraBajaCliente;

    @Column
    private LocalDateTime fechaHoraAltaCliente;

    // AGREGO ROL DE CLIENTE * Unico Rol del Cliente
    @ManyToOne
    private Rol rolCliente;
}
