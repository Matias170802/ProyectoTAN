package com.tan.seminario.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Movimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/*Lombok*/

public class Movimiento  extends Base {

    @Column (unique = true)
    private Long nroMovimiento;

    private String descripcionMovimiento;
    private Double montoMovimiento;
    private LocalDateTime fechaMovimiento;

    @ManyToOne
    @JoinColumn(name = "idTipoMovimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @ManyToOne
    @JoinColumn(name = "idCategoriaMovimiento", nullable = false)
    private CategoriaMovimiento categoriaMovimiento;

    @ManyToOne
    @JoinColumn(name = "idMoneda", nullable = false)
    private Moneda moneda;

    @ManyToOne
    @JoinColumn(name = "idCajaMadre", nullable = true)
    private CajaMadre cajaMadre;

    @ManyToOne
    @JoinColumn(name = "idInmuebleCaja", nullable = true)
    private InmuebleCaja inmuebleCaja;

    @ManyToOne
    @JoinColumn(name = "idEmpleadoCaja", nullable = true)
    private EmpleadoCaja empleadoCaja;

    @ManyToOne
    @JoinColumn(name = "idReserva", nullable = true)
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "idTarea", nullable = true)
    private Tarea tarea;
}
