package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Inmueble")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Inmueble  extends Base {

    @Column(unique = true)
    private String codInmueble;

    private String nombreInmueble;
    private Integer cantidadBaños;
    private Integer cantidadDormitorios;
    private Integer capacidad;
    private String direccion;
    private LocalDateTime fechaHoraAltaInmueble;
    private LocalDateTime fechaHoraBajaInmueble;
    private Double m2Inmueble;
    private Double precioPorNocheUSD;

    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false)
    private Cliente cliente;

}