package com.tan.seminario.backend.CasosDeUsos.Reportes;

import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.*;
import com.tan.seminario.backend.Entity.EstadoReserva;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Entity.Reserva;
import com.tan.seminario.backend.Repository.EstadoReservaRepository;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import com.tan.seminario.backend.Repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.util.List;

@Service
public class ExpertoReportes {

    private final InmuebleRepository inmuebleRepository;
    private final ReservaRepository reservaRepository;
    private final EstadoReservaRepository estadoReservaRepository;

    public ExpertoReportes(InmuebleRepository inmuebleRepository, ReservaRepository reservaRepository, EstadoReservaRepository estadoReservaRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.reservaRepository = reservaRepository;
        this.estadoReservaRepository = estadoReservaRepository;
    }

    // reportes de gerencia
    public List<DTOInmueblesFiltro> obtenerInmueblesFiltro() {
        List<Inmueble> inmueblesActivos = inmuebleRepository.findByFechaHoraBajaInmuebleIsNull();

        List <DTOInmueblesFiltro> dtos = new java.util.ArrayList<>();

        for (Inmueble inmueble: inmueblesActivos) {
            DTOInmueblesFiltro dto = DTOInmueblesFiltro.builder()
                    .codInmueble(inmueble.getCodInmueble())
                    .nombreInmueble(inmueble.getNombreInmueble())
                    .build();

            dtos.add(dto);
        }

        //en el caso de que NO hayan inmuebles disponibles
        if (dtos.isEmpty()) {
            throw new RuntimeException("No hay inmuebles disponibles");
        }

        return dtos;
    }

    public DTOEstadisticasGerenciaReservas obtenerEstadisticasGerenciaReservas(String anio, String mes) {
        //creo instancia de dtoEstadisticasGerenciaReservas
        DTOEstadisticasGerenciaReservas dtoAEnviar = DTOEstadisticasGerenciaReservas.builder().build();

        //defino las fechas limites para buscar en la bd como condiciones
        LocalDateTime fechaInicio;
        LocalDateTime fechaFin;

        //analizo si mes es igual o no a "todos" para definir como hacer la consulta al repository de reservas
        int year = Integer.parseInt(anio);

        if (mes.equalsIgnoreCase("todos")) {

            fechaInicio = LocalDateTime.of(year, 1, 1, 0, 0);
            fechaFin = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        } else {

            int month = Integer.parseInt(mes);

            YearMonth yearMonth = YearMonth.of(year, month);

            fechaInicio = yearMonth.atDay(1).atStartOfDay();
            fechaFin = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        }

        //busco instancia de estado Finalizada para luego buscar las reservas
        EstadoReserva estadoReservaFinalizada = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");

        //busco todas las instancias de reservas del año y mes correspondiente
        List<Reserva> reservas = reservaRepository.findByEstadoReservaAndFechaHoraInicioReservaBetween(estadoReservaFinalizada, fechaInicio, fechaFin);

        if (reservas.isEmpty()) {
            throw new RuntimeException("No existen datos disponibles en las fechas ingresadas");
        }

        //creo instancia de List dtoDetalleReservasGerencia y DTOIncidenciaInmuebles
        List<DTODetalleReservasGerencia> dtosDetalleReservasGerencia = new java.util.ArrayList<>();
        List<DTOIncidenciaInmuebles> dtosIncidenciaInmuebles = new java.util.ArrayList<>();

        //creo instancia de atributos para dsp asignarlos al dtoAEnviar
        Integer cantidadTotalReservas = 0;
        Integer cantidadTotalDiasReservados = 0;
        BigDecimal montoTotalGanado = BigDecimal.ZERO;
        BigDecimal montoPromedioPorReserva = BigDecimal.ZERO;

        //hago calculo de los atributos que acabo de crear
        for (Reserva reserva: reservas) {
            cantidadTotalReservas++;
            cantidadTotalDiasReservados += reserva.getTotalDias();
            montoTotalGanado = montoTotalGanado.add(BigDecimal.valueOf(reserva.getTotalMonto()));

            //asigno el dtoDetalleReserva
            DTODetalleReservasGerencia dto = DTODetalleReservasGerencia.builder()
                    .checkIn(reserva.getFechaHoraInicioReserva())
                    .checkOut(reserva.getFechaHoraFinReserva())
                    .estadoReserva(reserva.getEstadoReserva().getNombreEstadoReserva())
                    .dias(reserva.getTotalDias())
                    .huesped(reserva.getNombreHuesped())
                    .montoTotalReserva(BigDecimal.valueOf(reserva.getTotalMonto()))
                    .nombreInmueble(reserva.getInmueble().getNombreInmueble())
                    .build();

            //agrego el dto creado al list de dtos
            dtosDetalleReservasGerencia.add(dto);

        }

        //calculo el monto promedio por reserva
        montoPromedioPorReserva = montoTotalGanado.divide(BigDecimal.valueOf(cantidadTotalReservas), 2, BigDecimal.ROUND_HALF_UP);

        //calculo la incidencia de cada inmueble
        for (Reserva reserva: reservas) {

            //asigno el dtoIncidenciaInmuebles
            DTOIncidenciaInmuebles dtoIncidenciaInmuebles = DTOIncidenciaInmuebles.builder()
                    .codInmueble(reserva.getInmueble().getCodInmueble())
                    .nombreInmueble(reserva.getInmueble().getNombreInmueble())
                    .porcentajeIncidencia((reserva.getTotalDias() * 100) / cantidadTotalDiasReservados)
                    .build();

            dtosIncidenciaInmuebles.add(dtoIncidenciaInmuebles);

        }

        //asigno atributos calculados al dtoAEnviar
        dtoAEnviar.setCantTotalReservas(cantidadTotalReservas);
        dtoAEnviar.setDetalleReservas(dtosDetalleReservasGerencia);
        dtoAEnviar.setIncidenciaInmuebles(dtosIncidenciaInmuebles);
        dtoAEnviar.setMontoPromedioPorReserva(montoPromedioPorReserva);
        dtoAEnviar.setMontoTotalGanado(montoTotalGanado);
        dtoAEnviar.setDiasTotalesReservados(cantidadTotalDiasReservados);

        return dtoAEnviar;


    }

    // reportes de gerencia

    // reportes financieros

    public DTOReportesFinanzas obtenerEstadisticasFinancieras(String anio, String mes) {

        //creo instancia de dtoReportesFinanzas
        DTOReportesFinanzas dtoAEnviar = DTOReportesFinanzas.builder().build();

        //defino las fechas limites para buscar en la bd como condiciones
        LocalDateTime fechaInicio;
        LocalDateTime fechaFin;

        //analizo si mes es igual o no a "todos" para definir como hacer la consulta al repository de reservas
        int year = Integer.parseInt(anio);

        if (mes.equalsIgnoreCase("todos")) {

            fechaInicio = LocalDateTime.of(year, 1, 1, 0, 0);
            fechaFin = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        } else {

            int month = Integer.parseInt(mes);

            YearMonth yearMonth = YearMonth.of(year, month);

            fechaInicio = yearMonth.atDay(1).atStartOfDay();
            fechaFin = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        }

        //busco instancia de estado Finalizada para luego buscar las reservas
        EstadoReserva estadoReservaFinalizada = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");

        //busco todas las instancias de reservas del año y mes correspondiente
        List<Reserva> reservas = reservaRepository.findByEstadoReservaAndFechaHoraInicioReservaBetween(estadoReservaFinalizada, fechaInicio, fechaFin);

        if (reservas.isEmpty()) {
            throw new RuntimeException("No existen datos disponibles en las fechas ingresadas");
        }

        //creo la lista de dtoReservas que voy a guardar en el dtoAEnviar
        List<DTOEstadisticasReservasFinancieras> dtoReservas = new java.util.ArrayList<>();

        //defino variables que almacenan los valores calculados para luego asignarlos al dto
        BigDecimal montoTotalReservas = BigDecimal.ZERO;
        BigDecimal montoTotalCliente = BigDecimal.ZERO;
        BigDecimal montoTotalEmpresa = BigDecimal.ZERO;

        //calculo de los atributos del dto

            //calculo de la ganancia total en el periodo
        for (Reserva reserva: reservas) {
            //el 10% del total de la reserva se la queda la empresa
            montoTotalEmpresa = montoTotalEmpresa.add(BigDecimal.valueOf(reserva.getTotalMonto()).multiply(BigDecimal.valueOf(0.1)));
            montoTotalReservas = montoTotalReservas.add(BigDecimal.valueOf(reserva.getTotalMonto()));
            //le resto lo que se deja la empresa
            montoTotalCliente = montoTotalCliente.add(BigDecimal.valueOf(reserva.getTotalMonto()).subtract(BigDecimal.valueOf(reserva.getTotalMonto()).multiply(BigDecimal.valueOf(0.1))));

            //ESTADISTICAS DE RESERVAS
            //creo el dto por cada reserva para guardarlo en el dtoReservas
            DTOEstadisticasReservasFinancieras dtoReserva = DTOEstadisticasReservasFinancieras.builder()
                    .checkin(reserva.getFechaHoraInicioReserva())
                    .dias(reserva.getTotalDias())
                    .total(BigDecimal.valueOf(reserva.getTotalMonto()))
                    .gananciaCliente(BigDecimal.valueOf(reserva.getTotalMonto()).subtract(BigDecimal.valueOf(reserva.getTotalMonto()).multiply(BigDecimal.valueOf(0.1))))
                    .gananciaEmpresa(BigDecimal.valueOf(reserva.getTotalMonto()).multiply(BigDecimal.valueOf(0.1)))
                    .huesped(reserva.getNombreHuesped())
                    .inmueble(reserva.getInmueble().getNombreInmueble())
                    .build();

            //agrego el dto a la lista de dtoReservas
            dtoReservas.add(dtoReserva);
        }

        //asigno los atributos calculados
        dtoAEnviar.setGananciasCliente(montoTotalCliente);
        dtoAEnviar.setGananciasEmpresa(montoTotalEmpresa);
        dtoAEnviar.setGananciasTotales(montoTotalReservas);
        dtoAEnviar.setEstadisticasReservas(dtoReservas);

        //ESTADISTICAS DE INMUEBLES
        List<Inmueble> inmueblesActivos = inmuebleRepository.findByFechaHoraBajaInmuebleIsNull();

        //creo la lista que contiene a los dtos de cada inmueble
        List<DTOEstadisticasPorInmuebleFinancieras> dtosInmuebles = new java.util.ArrayList<>();

        for (Inmueble inmueble: inmueblesActivos) {
            //creo una lista donde se guardan SOLO las reservas del inmueble
            List<Reserva> reservasDelInmueble = new java.util.ArrayList<>();

            //busco las reservas que pertenezcan al inmueble
            for (Reserva reserva: reservas) {
                if (reserva.getInmueble().getCodInmueble().equals(inmueble.getCodInmueble())) {
                    reservasDelInmueble.add(reserva);
                }
            }

            //si el inmueble no ha tenido reservas en el periodo determinado no se lo manda a las estadisticas
            if (!reservasDelInmueble.isEmpty()) {
                //creo el dtoInmueblesFiltro
                DTOEstadisticasPorInmuebleFinancieras dtoInmueblesFiltro = DTOEstadisticasPorInmuebleFinancieras.builder().build();

                //seteamos el nombre del inmueble
                dtoInmueblesFiltro.setNombreInmueble(inmueble.getNombreInmueble());

                //hacemos el calculo de lo ganado para el cliente y para la empresa
                BigDecimal montoTotalClienteInmueble = BigDecimal.ZERO;
                BigDecimal montoTotalEmpresaInmueble = BigDecimal.ZERO;

                for (Reserva reservaInmueble: reservasDelInmueble) {
                    montoTotalEmpresaInmueble = montoTotalEmpresaInmueble.add(BigDecimal.valueOf(reservaInmueble.getTotalMonto()).multiply(BigDecimal.valueOf(0.1)));
                    montoTotalClienteInmueble = montoTotalClienteInmueble.add(BigDecimal.valueOf(reservaInmueble.getTotalMonto()).subtract(montoTotalEmpresaInmueble));
                }

                //asigno los atributos calculados al dtoInmuebleFiltro
                dtoInmueblesFiltro.setGananciasCliente(montoTotalClienteInmueble);
                dtoInmueblesFiltro.setGananciasEmpresa(montoTotalEmpresaInmueble);

                //asigno el dtoInmuebleFiltro a la lista de los dtoInmuebleFiltro
                dtosInmuebles.add(dtoInmueblesFiltro);

            }

            //asigno la lista de dtoInmuebles al DTOReportesFinanzas
            dtoAEnviar.setEstadisticasPorInmueble(dtosInmuebles);

        }

        return dtoAEnviar;

    }
    // reportes financieros

}
