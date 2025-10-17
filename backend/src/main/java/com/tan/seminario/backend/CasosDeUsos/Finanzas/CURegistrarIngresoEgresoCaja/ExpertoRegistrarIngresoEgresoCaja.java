package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
import com.tan.seminario.backend.Entity.TipoMovimiento;
import com.tan.seminario.backend.Repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpertoRegistrarIngresoEgresoCaja {
    private TipoMovimientoRepository tipoMovimientoRepository;

    public ExpertoRegistrarIngresoEgresoCaja(TipoMovimientoRepository tipoMovimientoRepository) {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
    }

    public List<DTOTipoTransaccion> buscarTiposTransaccion() {
        List<TipoMovimiento> tiposMovimientosExistentes = tipoMovimientoRepository.findByfechaHoraBajaTipoMovimientoIsNull();
        List<DTOTipoTransaccion> tiposTransaccionAEnviar = new java.util.ArrayList<>();

        for (TipoMovimiento tipoMovimiento: tiposMovimientosExistentes) {
            DTOTipoTransaccion dto = DTOTipoTransaccion.builder()
                    .nombreTipoTransaccion(tipoMovimiento.getNombreTipoMovimiento())
                    .build();
            tiposTransaccionAEnviar.add(dto);
        }

        return tiposTransaccionAEnviar;
    }

    public List<>
}
