package com.tan.seminario.backend.Initialazer;
//clase que se encarga de inicializar los datos que se encuentran en resourses cuando inicia la app y ha cambiado algo

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.ExpertoABMEmpleado;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitialazer {

    private final EstadoReservaRepository estadoReservaRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;
    private final TipoTareaRepository tipoTareaRepository;
    private final EstadoTareaRepository estadoTareaRepository;
    private final MonedaRepository monedaRepository;
    private final CategoriaMovimientoRepository categoriaMovimientoRepository;
    private final RolRepository rolRepository;
    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoRolRepository empleadoRolRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final CajaMadreRepository cajaMadreRepository;
    private final ExpertoABMEmpleado expertoABMEmpleado;

    // Constructor correcto para la inyección de dependencia
    public DataInitialazer(EstadoReservaRepository estadoReservaRepository, TipoMovimientoRepository tipoMovimientoRepository, TipoTareaRepository tipoTareaRepository, EstadoTareaRepository estadoTareaRepository, MonedaRepository monedaRepository, CategoriaMovimientoRepository categoriaMovimientoRepository, RolRepository rolRepository, EmpleadoRepository empleadoRepository, EmpleadoRolRepository empleadoRolRepository, ExpertoABMEmpleado expertoABMEmpleado, EmpleadoCajaRepository empleadoCajaRepository, CajaMadreRepository cajaMadreRepository) {
        this.estadoReservaRepository = estadoReservaRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.tipoTareaRepository = tipoTareaRepository;
        this.estadoTareaRepository = estadoTareaRepository;
        this.monedaRepository = monedaRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.rolRepository = rolRepository;
        this.empleadoRepository = empleadoRepository;
        this.empleadoRolRepository = empleadoRolRepository;
        this.expertoABMEmpleado = expertoABMEmpleado;
        this.empleadoCajaRepository = empleadoCajaRepository;
        this.cajaMadreRepository = cajaMadreRepository;
    }

    // ========================
    // DATOS DE PRUEBA RESERVAS E INMUEBLES (BORRAR AL FINAL)
    // ========================
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private InmuebleRepository inmuebleRepository;
    @Autowired
    private ClienteRepository clienteRepository;


    // ========================
    // FIN DATOS DE PRUEBA
    // ========================
    @PostConstruct
    public void initializeData() {

        //inicializacion de datos estado reserva
        if (estadoReservaRepository.count() == 0) {
            // Crear datos iniciales para EstadoReserva
            EstadoReserva estado1 = new EstadoReserva("EST001", "Señada", null, LocalDateTime.now());
            EstadoReserva estado2 = new EstadoReserva("EST002", "Cancelada", null, LocalDateTime.now());
            EstadoReserva estado3 = new EstadoReserva("EST003", "Finalizada", null, LocalDateTime.now());
            EstadoReserva estado4 = new EstadoReserva("EST004", "Preparada", null, LocalDateTime.now());
            EstadoReserva estado5 = new EstadoReserva("EST005", "En Curso", null, LocalDateTime.now());

            // Guardar estados en la base de datos
            estadoReservaRepository.saveAll(Arrays.asList(estado1, estado2, estado3, estado4, estado5));
            System.out.println("Datos iniciales de EstadoReserva insertados correctamente.");

        } else {
            System.out.println("La base de datos ya contiene datos de EstadoReserva, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos estado reserva

        // ========================
        // ZONA DE CREACION DE CLIENTES
        // ========================
        if (clienteRepository.count() == 0) {
            Cliente cli1 = new Cliente("44000000","CLI002","Matias Anselmi",null,LocalDateTime.now());
            Cliente cli2 = new Cliente("44000001","CLI003","Clara Mazuran",null,LocalDateTime.now());
            Cliente cli3 = new Cliente("44000002","CLI004","Jose Anselmi",null,LocalDateTime.now());
            Cliente cli4 = new Cliente("44000003","CLI005","Maria Mazuran",null,LocalDateTime.now());
            Cliente cli5 = new Cliente("44000004","CLI006","Mau",null,LocalDateTime.now());
            clienteRepository.saveAll(Arrays.asList(cli1, cli2, cli3, cli4, cli5));
        }

        // ========================
        // ZONA DE CREACION DE INMUEBLES Y RESERVAS DE PRUEBA
        // ========================
        // Crear inmuebles de ejemplo si no existen
        if (inmuebleRepository.count() == 0) {
            Cliente clienteDemo = new Cliente("44310665","CLI001","Juan",null,LocalDateTime.now());
            clienteRepository.save(clienteDemo);

            Inmueble in1 = new Inmueble("INM001", "Casa Chacras", 1, 2, 4, "Calle Falsa 123", LocalDateTime.now(), null, 60.0, 100.0, clienteDemo);
            Inmueble in2 = new Inmueble("INM002", "Casa Godoy Cruz", 2, 3, 8, "Av. Mar 456", LocalDateTime.now(), null, 120.0, 200.0, clienteDemo);
            Inmueble in3 = new Inmueble("INM003", "Cabaña Montaña", 1, 2, 5, "Ruta 7 km 20", LocalDateTime.now(), null, 80.0, 150.0, clienteDemo);
            Inmueble in4 = new Inmueble("INM004", "Terraoliva", 1, 1, 2, "Edificio Central Piso 5", LocalDateTime.now(), null, 40.0, 90.0, clienteDemo);
            inmuebleRepository.saveAll(Arrays.asList(in1, in2, in3, in4));
        }

        // Crear reservas de ejemplo si no existen
        if (reservaRepository.count() == 0) {
            Inmueble in1 = inmuebleRepository.findByCodInmueble("INM001");
            Inmueble in2 = inmuebleRepository.findByCodInmueble("INM002");
            Inmueble in3 = inmuebleRepository.findByCodInmueble("INM003");
            Inmueble in4 = inmuebleRepository.findByCodInmueble("INM004");

            EstadoReserva estSenada = estadoReservaRepository.findByNombreEstadoReserva("Señada");
            EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
            EstadoReserva estFinalizada = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");
            EstadoReserva estCancelada = estadoReservaRepository.findByNombreEstadoReserva("Cancelada");
            EstadoReserva estEnCurso = estadoReservaRepository.findByNombreEstadoReserva("En Curso");

            Reserva r1 = new Reserva("RES001", LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(7), LocalDateTime.now(), 5, 2,"Clara","261500001","clara@gmail.com", 25000.0, 10000.0, 10000.0, "Airbnb","Amable contactar por telefono", in1, estSenada);
            Reserva r2 = new Reserva("RES002", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(15), LocalDateTime.now(), 5, 4, "Matias", "261500001", "matias@gmail.com", 35000.0, 15000.0, 15000.0, "Booking", "", in2, estSenada);
            Reserva r3 = new Reserva("RES003", LocalDateTime.now().plusDays(20), LocalDateTime.now().plusDays(25), LocalDateTime.now(), 5, 3, "Juan", "261500001", "juan@gmail.com", 30000.0, 12000.0, 12000.0, "Directo", "Son 3 una familia", in3, estPreparada);
            Reserva r4 = new Reserva("RES004", LocalDateTime.now().minusDays(30), LocalDateTime.now().minusDays(35), LocalDateTime.now(), 5, 2, "Fernando", "261500001", "fernando@gmail.com", 22000.0, 8000.0, 8000.0, "Airbnb", "Contactar por mail", in4, estFinalizada);
            Reserva r5 = new Reserva("RES005", LocalDateTime.now().plusDays(40), LocalDateTime.now().plusDays(45), LocalDateTime.now(), 5, 2, "Nico", "261500001", "nico@gmail.com", 27000.0, 9000.0, 9000.0, "Booking", "Pareja", in1, estCancelada);
            Reserva r6 = new Reserva("RES006",LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(7), LocalDateTime.now(), 8, 3, "Ruben", "261500001", "ruben@gmail.com", 32000.0, 9000.0, 9000.0, "Booking", "Familia", in3, estEnCurso);
            reservaRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6));
            System.out.println("Reservas e inmuebles de prueba insertados correctamente.");
        }
        // ========================
        // FIN ZONA DE CREACION DE INMUEBLES Y RESERVAS DE PRU  EBA
        // ========================

        //inicializacion de datos tipo movimiento
        if (tipoMovimientoRepository.count() == 0) {
            TipoMovimiento tipo1 = new TipoMovimiento("TI001", "Ingreso", null, LocalDateTime.now());
            TipoMovimiento tipo2 = new TipoMovimiento("TI002", "Egreso", null, LocalDateTime.now());

            tipoMovimientoRepository.saveAll(Arrays.asList(tipo1, tipo2));
            System.out.println("Datos iniciales de TipoMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de TipoMovimiento, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos tipo movimiento

        //inicializacion de datos Tipo tarea
        if (tipoTareaRepository.count() == 0) {
            TipoTarea tipoTarea1 = new TipoTarea( "TT001", "Check-In", LocalDateTime.now(), null);
            TipoTarea tipoTarea2 = new TipoTarea( "TT002", "Check-Out", LocalDateTime.now(), null);
            TipoTarea tipoTarea3 = new TipoTarea( "TT003", "Pago Sueldos", LocalDateTime.now(), null);
            TipoTarea tipoTarea4 = new TipoTarea( "TT004", "Cobro de Inmuebles", LocalDateTime.now(), null);

            tipoTareaRepository.saveAll(Arrays.asList(tipoTarea1, tipoTarea2, tipoTarea3, tipoTarea4));
            System.out.println("Datos iniciales de TipoTarea insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de TipoTarea, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos Tipo tarea

        //inicializacion de datos estado tarea
        if (estadoTareaRepository.count() == 0) {
            EstadoTarea estadoTarea1 = new EstadoTarea( "EST001", "Asignada", null, LocalDateTime.now());
            EstadoTarea estadoTarea2 = new EstadoTarea( "EST002", "Anulada", null, LocalDateTime.now());
            EstadoTarea estadoTarea3 = new EstadoTarea( "EST003", "Finalizada", null, LocalDateTime.now());

            estadoTareaRepository.saveAll(Arrays.asList(estadoTarea1, estadoTarea2, estadoTarea3));
            System.out.println("Datos iniciales de EstadoTarea insertados correctamente.");

        } else {
            System.out.println("La base de datos ya contiene datos de EstadoTarea, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos estado tarea

        //inicializacion de datos moneda
        if (monedaRepository.count() == 0) {
            Moneda moneda1 = new Moneda( "MON001", "Peso Argentino", LocalDateTime.now(), null);
            Moneda moneda2 = new Moneda( "MON002", "Dolar", LocalDateTime.now(), null);

            monedaRepository.saveAll(Arrays.asList(moneda1, moneda2));
            System.out.println("Datos iniciales de Moneda insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de Moneda, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos moneda

        //inicializacion de datos categoria movimiento
        if (categoriaMovimientoRepository.count() == 0) {

            CategoriaMovimiento categoriaMovimiento1 = new CategoriaMovimiento( "CAT001", "Seña", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento2 = new CategoriaMovimiento("CAT002", "Sueldo", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento3 = new CategoriaMovimiento( "CAT003", "Cancelacion Reserva", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento4 = new CategoriaMovimiento( "CAT004", "Rendicion a Inmueble", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento5 = new CategoriaMovimiento( "CAT005", "Rendicion de Empleado", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento6 = new CategoriaMovimiento( "CAT006", "Otros", LocalDateTime.now(), null);

            categoriaMovimientoRepository.saveAll(Arrays.asList(categoriaMovimiento1, categoriaMovimiento2, categoriaMovimiento3, categoriaMovimiento4, categoriaMovimiento5, categoriaMovimiento6));
            System.out.println("Datos iniciales de CategoriaMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de CategoriaMovimiento, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos categoria movimiento

        //inicializacion de datos roles
        if (rolRepository.count() == 0) {

            Rol rol1 = new Rol( "ROL001", "Administrador Financiero", null, LocalDateTime.now());
            Rol rol2 = new Rol( "ROL002", "Gerencia", null, LocalDateTime.now());
            Rol rol3 = new Rol( "ROL003", "Empleado", null, LocalDateTime.now());
            Rol rol4 = new Rol( "ROL004", "Administrador de Reservas", null, LocalDateTime.now());
            Rol rol5 = new Rol( "ROL005", "Administrador del Sistema", null, LocalDateTime.now());

            rolRepository.saveAll(Arrays.asList(rol1, rol2, rol3, rol4, rol5));
            System.out.println("Datos iniciales de Rol insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de Rol, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos roles

        //inicializacion de caja madre
        if (cajaMadreRepository.count() == 0) {
            CajaMadre cajaMadre = CajaMadre.builder()
                    .nroCajaMadre(1L)
                    .nombreCajaMadre("Caja Madre")
                    .balanceTotalARS(BigDecimal.ZERO)
                    .balanceTotalUSD(BigDecimal.ZERO)
                    .fechaHoraAltaCajaMadre(LocalDateTime.now())
                    .build();

            cajaMadreRepository.save(cajaMadre);
            System.out.println("Datos iniciales de CajaMadre insertados correctamente.");
        }
        //inicializacion de caja madre

        //Iniciacion de Empleado maestro
        if (empleadoRepository.count() == 0) {
            Empleado empleado1 = new Empleado("44310665","EMPL-001","Matias","2615199115", 200L,null,LocalDateTime.now(),null,null);
            Empleado empleado2 = new Empleado("44000000","EMPL-002","Mauri","2615199115", 200L,null,LocalDateTime.now(),null,null);
            Empleado empleado3 = new Empleado("44555555", "EMPL-003", "Clara", "2615000000", 200L, null, LocalDateTime.now(), null, null);
            Empleado empleado4 = new Empleado("44666666", "EMPL-004", "Juan", "2615111111", 200L, null, LocalDateTime.now(), null, null);
            Empleado empleado5 = new Empleado("44777777", "EMPL-005", "Lucia", "2615222222", 200L, null, LocalDateTime.now(), null, null);
            empleadoRepository.saveAll(Arrays.asList(empleado1,empleado2,empleado3,empleado4,empleado5));

            // Crear cajas de empleados
            EmpleadoCaja empleadoCaja1 = EmpleadoCaja.builder()
                    .empleado(empleado1)
                    .nroEmpleadoCaja(1L)
                    .nombreEmpleadoCaja(empleado1.getNombreEmpleado())
                    .balanceARS(BigDecimal.ZERO)
                    .balanceUSD(BigDecimal.ZERO)
                    .fechaHoraAltaEmpleadoCaja(LocalDateTime.now())
                    .fechaHoraBajaEmpleadoCaja(null)
                    .build();
            EmpleadoCaja empleadoCaja2 = EmpleadoCaja.builder()
                    .empleado(empleado2)
                    .nroEmpleadoCaja(2L)
                    .nombreEmpleadoCaja(empleado2.getNombreEmpleado())
                    .balanceARS(BigDecimal.ZERO)
                    .balanceUSD(BigDecimal.ZERO)
                    .fechaHoraAltaEmpleadoCaja(LocalDateTime.now())
                    .fechaHoraBajaEmpleadoCaja(null)
                    .build();
            EmpleadoCaja empleadoCaja3 = EmpleadoCaja.builder()
                    .empleado(empleado3)
                    .nroEmpleadoCaja(3L)
                    .nombreEmpleadoCaja(empleado3.getNombreEmpleado())
                    .balanceARS(BigDecimal.ZERO)
                    .balanceUSD(BigDecimal.ZERO)
                    .fechaHoraAltaEmpleadoCaja(LocalDateTime.now())
                    .fechaHoraBajaEmpleadoCaja(null)
                    .build();
            EmpleadoCaja empleadoCaja4 = EmpleadoCaja.builder()
                    .empleado(empleado4)
                    .nroEmpleadoCaja(4L)
                    .nombreEmpleadoCaja(empleado4.getNombreEmpleado())
                    .balanceARS(BigDecimal.ZERO)
                    .balanceUSD(BigDecimal.ZERO)
                    .fechaHoraAltaEmpleadoCaja(LocalDateTime.now())
                    .fechaHoraBajaEmpleadoCaja(null)
                    .build();
            EmpleadoCaja empleadoCaja5 = EmpleadoCaja.builder()
                    .empleado(empleado5)
                    .nroEmpleadoCaja(5L)
                    .nombreEmpleadoCaja(empleado5.getNombreEmpleado())
                    .balanceARS(BigDecimal.ZERO)
                    .balanceUSD(BigDecimal.ZERO)
                    .fechaHoraAltaEmpleadoCaja(LocalDateTime.now())
                    .fechaHoraBajaEmpleadoCaja(null)
                    .build();
            empleadoCajaRepository.saveAll(Arrays.asList(empleadoCaja1, empleadoCaja2, empleadoCaja3, empleadoCaja4, empleadoCaja5));
            System.out.println("Datos iniciales de Empleado insertados correctamente.");
        }

        if (empleadoRepository.findByDniEmpleado("44564456").isEmpty()) {
            // Empleado Maestro
            AltaEmpleadoRequest empleadoRequest = AltaEmpleadoRequest.builder()
                    .dniEmpleado("44564456")
                    .nombreEmpleado("Mauricio")
                    .nroTelefonoEmpleado("2615199115")
                    .salarioEmpleado(200L)
                    .codRoles(Arrays.asList("ROL001", "ROL002", "ROL003", "ROL004", "ROL005"))
                    .email("mauricio@gmail.com")
                    .password("Passw0rd!")
                    .build();

            AltaEmpleadoResponse empleadoMaestro = expertoABMEmpleado.altaEmpleado(empleadoRequest);
        } else {
            System.out.println("Empleado maestro ya existente!");
        }
    }
}
