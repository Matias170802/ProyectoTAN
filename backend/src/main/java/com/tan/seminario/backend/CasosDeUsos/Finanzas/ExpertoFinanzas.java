package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.Entity.CajaMadre;
import com.tan.seminario.backend.Entity.EmpleadoCaja;
import com.tan.seminario.backend.Entity.InmuebleCaja;
import com.tan.seminario.backend.Repository.CajaMadreRepository;
import com.tan.seminario.backend.Repository.EmpleadoCajaRepository;
import com.tan.seminario.backend.Repository.InmuebleCajaRepository;
import org.springframework.stereotype.Service;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOCajas;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoFinanzas {

    private final CajaMadreRepository cajaMadreRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final InmuebleCajaRepository inmuebleCajaRepository;

    public ExpertoFinanzas(CajaMadreRepository cajaMadreRepository, EmpleadoCajaRepository empleadoCajaRepository, InmuebleCajaRepository inmuebleCajaRepository) {
        this.cajaMadreRepository = cajaMadreRepository;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.inmuebleCajaRepository = inmuebleCajaRepository;
    }


    public List<DTOCajas> buscarCajas () {
        List<DTOCajas> cajasAEnviar = new ArrayList<>();

        List<CajaMadre> cajasMadresExistentes = cajaMadreRepository.findCajaMadreByFechaHoraBajaCajaMadreIsNull();
        for (CajaMadre cajamadre: cajasMadresExistentes) {
            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(cajamadre.getBalanceTotalARS())
                    .balanceUSD(cajamadre.getBalanceTotalUSD())
                    .tipo("Otro")
                    .nombre(cajamadre.getNombreCajaMadre())
                    //todo: ver como buscar el ultimo movimiento de la caja
                    //.ultimoMovimiento()
                    .build();
            cajasAEnviar.add(dto);
        }

        List<EmpleadoCaja> empleadoCajasExistentes = empleadoCajaRepository.findEmpleadoCajaByFechaHoraBajaEmpleadoCajaIsNull();
        for (EmpleadoCaja empleadocaja: empleadoCajasExistentes) {
            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(empleadocaja.getBalanceARS())
                    .balanceUSD(empleadocaja.getBalanceUSD())
                    .tipo("Empleado")
                    .nombre(empleadocaja.getNombreEmpleadoCaja())
                    //todo: ver como buscar el ultimo movimiento de la caja
                    //.ultimoMovimiento()
                    .build();
            cajasAEnviar.add(dto);
        }

        List<InmuebleCaja> inmueblesCajasExistentes = inmuebleCajaRepository.findInmuebleCajaByFechaHoraBajaInmuebleCajaIsNull();
        for (InmuebleCaja inmueblecaja: inmueblesCajasExistentes) {
            DTOCajas dto = DTOCajas.builder()
                    .balanceARS(inmueblecaja.getBalanceTotalARS())
                    .balanceUSD(inmueblecaja.getBalanceTotalUSD())
                    .tipo("Inmueble")
                    .nombre(inmueblecaja.getNombreInmuebleCaja())
                    //todo: ver como buscar el ultimo movimiento de la caja
                    //.ultimoMovimiento()
                    .build();
            cajasAEnviar.add(dto);
        }

        return cajasAEnviar;
    }
}
