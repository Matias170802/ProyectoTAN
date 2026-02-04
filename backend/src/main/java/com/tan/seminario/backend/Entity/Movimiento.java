package com.tan.seminario.backend.Entity;

import com.tan.seminario.backend.Repository.MovimientoRepository;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/*Lombok*/
@Entity
@Table(name = "Movimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*Lombok*/

public class Movimiento  extends Base {

    @Column(unique = true)
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

    public static Long generarProximoNumero(MovimientoRepository repository) {
        Long ultimoNumero = repository.findMaxNroMovimiento();
        return (ultimoNumero != null) ? ultimoNumero + 1 : 1L;
    }

    /**
     * Builder personalizado que auto-genera el número
     */
//    public Movimiento builderConNumero(MovimientoRepository repository) {
//        return Movimiento.builder()
//                .nroMovimiento(generarProximoNumero(repository));
//    }
}
