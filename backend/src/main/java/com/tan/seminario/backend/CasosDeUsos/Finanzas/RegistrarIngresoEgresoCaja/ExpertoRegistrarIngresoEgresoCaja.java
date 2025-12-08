package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOCategoriaMovimiento;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpertoRegistrarIngresoEgresoCaja {
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final MonedaRepository monedaRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final MovimientoRepository movimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;

    public ExpertoRegistrarIngresoEgresoCaja(TipoMovimientoRepository tipoMovimientoRepository, MonedaRepository monedaRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, MovimientoRepository movimientoRepository, UsuarioRepository usuarioRepository, EmpleadoCajaRepository empleadoCajaRepository)  {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.monedaRepository = monedaRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.movimientoRepository = movimientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
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

    public List<DTOMoneda> buscarTiposMoneda() {
        List<Moneda> monedasExistentes = monedaRepository.findByfechaHoraBajaMonedaIsNull();
        List<DTOMoneda> monedasAEnviar = new java.util.ArrayList<>();

        for (Moneda moneda: monedasExistentes) {
            DTOMoneda dto = DTOMoneda.builder()
                    .nombreMoneda(moneda.getNombreMoneda())
                    .build();
            monedasAEnviar.add(dto);
        }
        return monedasAEnviar;
    }

    public List<DTOCategoriaMovimiento> buscarCategoriasMovimiento () {
        List<CategoriaMovimiento> categoriaMovimientoExistentes = categoriaMovimientoRepository.findByFechaHoraBajaCategoriaMovimientoIsNull();
        List<DTOCategoriaMovimiento> categoriaMovimientoAEnviar = new java.util.ArrayList<>();

        for (CategoriaMovimiento categoriaMovimiento : categoriaMovimientoExistentes) {
            DTOCategoriaMovimiento dto = DTOCategoriaMovimiento.builder()
                    .nombreCategoria(categoriaMovimiento.getNombreCategoriaMovimiento())
                    .build();

            categoriaMovimientoAEnviar.add(dto);
        }

        return categoriaMovimientoAEnviar;
    }

    public Movimiento registrarMovimiento (DTOTransaccionARegistrar transaccionARegistrar, String username) {
        Moneda monedaSeleccionada = monedaRepository.findBynombreMoneda(transaccionARegistrar.getMoneda());
        TipoMovimiento tipoMovimientoSeleccionado = tipoMovimientoRepository.findBynombreTipoMovimiento(transaccionARegistrar.getTipoTransaccion());
        CategoriaMovimiento categoriaMovimientoSeleccionada = categoriaMovimientoRepository.findBynombreCategoriaMovimiento(transaccionARegistrar.getCategoria());
        Usuario usuarioActivo = usuarioRepository.findByEmail(username).get();
        Empleado empleadoActivo = usuarioActivo.getEmpleado();

        EmpleadoCaja cajaEmpleadoActivo = empleadoCajaRepository.findByEmpleadoAndFechaHoraBajaEmpleadoCajaIsNull(empleadoActivo);

        Movimiento nuevoMovimiento = Movimiento.builderConNumero(movimientoRepository)
                .moneda(monedaSeleccionada)
                .descripcionMovimiento(transaccionARegistrar.getDescripcion())
                .montoMovimiento(transaccionARegistrar.getMonto())
                .fechaMovimiento(LocalDateTime.now())
                .categoriaMovimiento(categoriaMovimientoSeleccionada)
                .tipoMovimiento(tipoMovimientoSeleccionado)
                .empleadoCaja(cajaEmpleadoActivo)
                .build();

        movimientoRepository.save(nuevoMovimiento);

        return nuevoMovimiento;
    }
}
