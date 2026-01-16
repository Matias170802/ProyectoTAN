package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO;

import com.tan.seminario.backend.Entity.*;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DTOMovimiento {

    private Long nroMovimiento;
    private String descripcionMovimiento;
    private Double montoMovimiento;
    private LocalDateTime fechaMovimiento;
    private String codTipoMovimiento;
    private String codCategoriaMovimiento;
    private String codMoneda;
    private Long nroCajaMadre;
    private Long nroInmuebleCaja;
    private Long nroEmpleadoCaja;
    private String codReserva;
    private Long nroTarea;
}
