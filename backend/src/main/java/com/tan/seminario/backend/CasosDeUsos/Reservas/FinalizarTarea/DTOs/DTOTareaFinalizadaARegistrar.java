package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.Entity.Movimiento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DTOTareaFinalizadaARegistrar {
    private String nombreTarea;
    private List<DTOTransaccionARegistrar> movimientosARegistrar = new java.util.ArrayList<>();
}
