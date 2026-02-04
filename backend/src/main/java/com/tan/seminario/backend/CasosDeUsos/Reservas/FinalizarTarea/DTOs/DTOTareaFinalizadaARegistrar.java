package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
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
    private Long nroTarea;
    private List<DTOTransaccionARegistrar> movimientosARegistrar = new java.util.ArrayList<>();
}
