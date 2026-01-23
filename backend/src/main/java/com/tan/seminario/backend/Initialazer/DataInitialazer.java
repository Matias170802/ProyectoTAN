package com.tan.seminario.backend.Initialazer;
// NOTA: Si obtienes error de "valor demasiado largo para character varying(255)",
// necesitas modificar la entidad Token para aumentar el tamaño del campo token

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.ExpertoABMCliente;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.ExpertoABMEmpleado;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
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
    private final TareaRepository tareaRepository;
    private final ExpertoABMEmpleado expertoABMEmpleado;
    private final ExpertoABMCliente expertoABMCliente;

    public DataInitialazer(EstadoReservaRepository estadoReservaRepository,
                           TipoMovimientoRepository tipoMovimientoRepository,
                           TipoTareaRepository tipoTareaRepository,
                           EstadoTareaRepository estadoTareaRepository,
                           MonedaRepository monedaRepository,
                           CategoriaMovimientoRepository categoriaMovimientoRepository,
                           RolRepository rolRepository,
                           EmpleadoRepository empleadoRepository,
                           EmpleadoRolRepository empleadoRolRepository,
                           ExpertoABMEmpleado expertoABMEmpleado,
                           EmpleadoCajaRepository empleadoCajaRepository,
                           CajaMadreRepository cajaMadreRepository,
                           TareaRepository tareaRepository,
                           ExpertoABMCliente expertoABMCliente) {
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
        this.tareaRepository = tareaRepository;
        this.expertoABMCliente = expertoABMCliente;
    }

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private InmuebleRepository inmuebleRepository;
    @Autowired
    private ClienteRepository clienteRepository;

    @PostConstruct
    public void initializeData() {
        StringBuilder credenciales = new StringBuilder();
        credenciales.append("# Credenciales del Sistema\n\n");
        credenciales.append("Generado el: ").append(LocalDateTime.now()).append("\n\n");
        credenciales.append("---\n\n");

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

            Reserva r1 = new Reserva("RES001", LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(7), LocalDateTime.now(), 5, 2,"Clara","261500001","clara@gmail.com", 25000.0, 10000.0, 10000.0, "Airbnb","Amable contactar por telefono",Boolean.FALSE, in1, estSenada);
            Reserva r2 = new Reserva("RES002", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(15), LocalDateTime.now(), 5, 4, "Matias", "261500001", "matias@gmail.com", 35000.0, 15000.0, 15000.0, "Booking", "",Boolean.FALSE, in2, estSenada);
            Reserva r3 = new Reserva("RES003", LocalDateTime.now().plusDays(20), LocalDateTime.now().plusDays(25), LocalDateTime.now(), 5, 3, "Juan", "261500001", "juan@gmail.com", 30000.0, 12000.0, 12000.0, "Directo", "Son 3 una familia",Boolean.FALSE, in3, estPreparada);
            Reserva r4 = new Reserva("RES004", LocalDateTime.now().minusDays(30), LocalDateTime.now().minusDays(35), LocalDateTime.now(), 5, 2, "Fernando", "261500001", "fernando@gmail.com", 22000.0, 8000.0, 8000.0, "Airbnb", "Contactar por mail",Boolean.TRUE, in4, estFinalizada);
            Reserva r5 = new Reserva("RES005", LocalDateTime.now().plusDays(40), LocalDateTime.now().plusDays(45), LocalDateTime.now(), 5, 2, "Nico", "261500001", "nico@gmail.com", 27000.0, 9000.0, 9000.0, "Booking", "Pareja",Boolean.FALSE, in1, estCancelada);
            Reserva r6 = new Reserva("RES006",LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(7), LocalDateTime.now(), 8, 3, "Ruben", "261500001", "ruben@gmail.com", 32000.0, 9000.0, 9000.0, "Booking", "Familia",Boolean.TRUE, in3, estEnCurso);
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





        // Crear empleados con diferentes combinaciones de roles
        credenciales.append("## Empleados\n\n");

        // 1. Mauricio - SUPER USUARIO (Empleado Maestro Original)
        if (empleadoRepository.findByDniEmpleado("44564456").isEmpty()) {
            AltaEmpleadoRequest mauricio = AltaEmpleadoRequest.builder()
                    .dniEmpleado("44564456")
                    .nombreEmpleado("Mauricio")
                    .nroTelefonoEmpleado("2615199115")
                    .salarioEmpleado(500000L)
                    .codRoles(Arrays.asList("ROL001", "ROL002", "ROL003", "ROL004", "ROL005"))
                    .email("mauricio@gmail.com")
                    .password("Passw0rd!")
                    .build();
            expertoABMEmpleado.altaEmpleado(mauricio);
            credenciales.append("### 1. Mauricio - SUPER USUARIO (Todos los roles)\n");
            credenciales.append("- **Email:** mauricio@gmail.com\n");
            credenciales.append("- **Password:** Passw0rd!\n");
            credenciales.append("- **DNI:** 44564456\n");
            credenciales.append("- **Teléfono:** 2615199115\n");
            credenciales.append("- **Roles:** Administrador Financiero, Gerencia, Empleado, Administrador de Reservas, Administrador del Sistema\n");
            credenciales.append("- **Nota:** ⭐ Empleado maestro original del sistema\n\n");
        }

        // 2. Solo Empleado
        if (empleadoRepository.findByDniEmpleado("22222222").isEmpty()) {
            AltaEmpleadoRequest emp2 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("22222222")
                    .nombreEmpleado("Juan Perez")
                    .nroTelefonoEmpleado("2615000002")
                    .salarioEmpleado(200000L)
                    .codRoles(Arrays.asList("ROL003"))
                    .email("juan.perez@empresa.com")
                    .password("Juan123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp2);
            credenciales.append("### 2. Juan Perez (Solo Empleado)\n");
            credenciales.append("- **Email:** juan.perez@empresa.com\n");
            credenciales.append("- **Password:** Juan123!\n");
            credenciales.append("- **DNI:** 22222222\n");
            credenciales.append("- **Roles:** Empleado\n\n");
        }

        // 3. Gerencia + Empleado
        if (empleadoRepository.findByDniEmpleado("33333333").isEmpty()) {
            AltaEmpleadoRequest emp3 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("33333333")
                    .nombreEmpleado("Maria Garcia")
                    .nroTelefonoEmpleado("2615000003")
                    .salarioEmpleado(400000L)
                    .codRoles(Arrays.asList("ROL002", "ROL003"))
                    .email("maria.garcia@empresa.com")
                    .password("Maria123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp3);
            credenciales.append("### 3. Maria Garcia (Gerencia + Empleado)\n");
            credenciales.append("- **Email:** maria.garcia@empresa.com\n");
            credenciales.append("- **Password:** Maria123!\n");
            credenciales.append("- **DNI:** 33333333\n");
            credenciales.append("- **Roles:** Gerencia, Empleado\n\n");
        }

        // 4. Administrador Financiero + Empleado
        if (empleadoRepository.findByDniEmpleado("44444444").isEmpty()) {
            AltaEmpleadoRequest emp4 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("44444444")
                    .nombreEmpleado("Carlos Rodriguez")
                    .nroTelefonoEmpleado("2615000004")
                    .salarioEmpleado(350000L)
                    .codRoles(Arrays.asList("ROL001", "ROL003"))
                    .email("carlos.rodriguez@empresa.com")
                    .password("Carlos123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp4);
            credenciales.append("### 4. Carlos Rodriguez (Administrador Financiero + Empleado)\n");
            credenciales.append("- **Email:** carlos.rodriguez@empresa.com\n");
            credenciales.append("- **Password:** Carlos123!\n");
            credenciales.append("- **DNI:** 44444444\n");
            credenciales.append("- **Roles:** Administrador Financiero, Empleado\n\n");
        }

        // 5. Administrador de Reservas + Empleado
        if (empleadoRepository.findByDniEmpleado("55555555").isEmpty()) {
            AltaEmpleadoRequest emp5 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("55555555")
                    .nombreEmpleado("Laura Martinez")
                    .nroTelefonoEmpleado("2615000005")
                    .salarioEmpleado(300000L)
                    .codRoles(Arrays.asList("ROL004", "ROL003"))
                    .email("laura.martinez@empresa.com")
                    .password("Laura123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp5);
            credenciales.append("### 5. Laura Martinez (Administrador de Reservas + Empleado)\n");
            credenciales.append("- **Email:** laura.martinez@empresa.com\n");
            credenciales.append("- **Password:** Laura123!\n");
            credenciales.append("- **DNI:** 55555555\n");
            credenciales.append("- **Roles:** Administrador de Reservas, Empleado\n\n");
        }

        // 6. Administrador del Sistema + Empleado
        if (empleadoRepository.findByDniEmpleado("66666666").isEmpty()) {
            AltaEmpleadoRequest emp6 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("66666666")
                    .nombreEmpleado("Pedro Fernandez")
                    .nroTelefonoEmpleado("2615000006")
                    .salarioEmpleado(380000L)
                    .codRoles(Arrays.asList("ROL005", "ROL003"))
                    .email("pedro.fernandez@empresa.com")
                    .password("Pedro123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp6);
            credenciales.append("### 6. Pedro Fernandez (Administrador del Sistema + Empleado)\n");
            credenciales.append("- **Email:** pedro.fernandez@empresa.com\n");
            credenciales.append("- **Password:** Pedro123!\n");
            credenciales.append("- **DNI:** 66666666\n");
            credenciales.append("- **Roles:** Administrador del Sistema, Empleado\n\n");
        }

        // 7. Gerencia + Administrador Financiero + Empleado
        if (empleadoRepository.findByDniEmpleado("77777777").isEmpty()) {
            AltaEmpleadoRequest emp7 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("77777777")
                    .nombreEmpleado("Ana Lopez")
                    .nroTelefonoEmpleado("2615000007")
                    .salarioEmpleado(450000L)
                    .codRoles(Arrays.asList("ROL002", "ROL001", "ROL003"))
                    .email("ana.lopez@empresa.com")
                    .password("Ana123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp7);
            credenciales.append("### 7. Ana Lopez (Gerencia + Administrador Financiero + Empleado)\n");
            credenciales.append("- **Email:** ana.lopez@empresa.com\n");
            credenciales.append("- **Password:** Ana123!\n");
            credenciales.append("- **DNI:** 77777777\n");
            credenciales.append("- **Roles:** Gerencia, Administrador Financiero, Empleado\n\n");
        }

        // 8. Gerencia + Administrador de Reservas + Empleado
        if (empleadoRepository.findByDniEmpleado("88888888").isEmpty()) {
            AltaEmpleadoRequest emp8 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("88888888")
                    .nombreEmpleado("Roberto Sanchez")
                    .nroTelefonoEmpleado("2615000008")
                    .salarioEmpleado(420000L)
                    .codRoles(Arrays.asList("ROL002", "ROL004", "ROL003"))
                    .email("roberto.sanchez@empresa.com")
                    .password("Roberto123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp8);
            credenciales.append("### 8. Roberto Sanchez (Gerencia + Administrador de Reservas + Empleado)\n");
            credenciales.append("- **Email:** roberto.sanchez@empresa.com\n");
            credenciales.append("- **Password:** Roberto123!\n");
            credenciales.append("- **DNI:** 88888888\n");
            credenciales.append("- **Roles:** Gerencia, Administrador de Reservas, Empleado\n\n");
        }

        // 9. Administrador Financiero + Administrador de Reservas + Empleado
        if (empleadoRepository.findByDniEmpleado("99999999").isEmpty()) {
            AltaEmpleadoRequest emp9 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("99999999")
                    .nombreEmpleado("Sofia Torres")
                    .nroTelefonoEmpleado("2615000009")
                    .salarioEmpleado(380000L)
                    .codRoles(Arrays.asList("ROL001", "ROL004", "ROL003"))
                    .email("sofia.torres@empresa.com")
                    .password("Sofia123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp9);
            credenciales.append("### 9. Sofia Torres (Administrador Financiero + Administrador de Reservas + Empleado)\n");
            credenciales.append("- **Email:** sofia.torres@empresa.com\n");
            credenciales.append("- **Password:** Sofia123!\n");
            credenciales.append("- **DNI:** 99999999\n");
            credenciales.append("- **Roles:** Administrador Financiero, Administrador de Reservas, Empleado\n\n");
        }

        // 10. Administrador del Sistema + Gerencia + Empleado
        if (empleadoRepository.findByDniEmpleado("10101010").isEmpty()) {
            AltaEmpleadoRequest emp10 = AltaEmpleadoRequest.builder()
                    .dniEmpleado("10101010")
                    .nombreEmpleado("Diego Ramirez")
                    .nroTelefonoEmpleado("2615000010")
                    .salarioEmpleado(470000L)
                    .codRoles(Arrays.asList("ROL005", "ROL002", "ROL003"))
                    .email("diego.ramirez@empresa.com")
                    .password("Diego123!")
                    .build();
            expertoABMEmpleado.altaEmpleado(emp10);
            credenciales.append("### 10. Diego Ramirez (Administrador del Sistema + Gerencia + Empleado)\n");
            credenciales.append("- **Email:** diego.ramirez@empresa.com\n");
            credenciales.append("- **Password:** Diego123!\n");
            credenciales.append("- **DNI:** 10101010\n");
            credenciales.append("- **Roles:** Administrador del Sistema, Gerencia, Empleado\n\n");
        }

        // Crear Cliente
        credenciales.append("---\n\n");
        credenciales.append("## Cliente\n\n");

        if (clienteRepository.findByDniCliente("20202020").isEmpty()) {
            DTOAltaClienteRequest clienteRequest = DTOAltaClienteRequest.builder()
                    .dniCliente("20202020")
                    .nombreCliente("Cliente Demo")
                    .email("cliente.demo@gmail.com")
                    .build();

            DTOAltaClienteResponse clienteResponse = expertoABMCliente.altaCliente(clienteRequest);

            credenciales.append("### Cliente Demo\n");
            credenciales.append("- **Email:** ").append(clienteResponse.getEmail()).append("\n");
            credenciales.append("- **Password:** ").append(clienteResponse.getPassword()).append("\n");
            credenciales.append("- **DNI:** 20202020\n");
            credenciales.append("- **Código Cliente:** ").append(clienteResponse.getCodCliente()).append("\n\n");
        }

        credenciales.append("---\n\n");
        credenciales.append("## Notas\n\n");
        credenciales.append("- Todas las contraseñas siguen el formato: `NombreCapitalizado123!`\n");
        credenciales.append("- Los empleados tienen el rol \"Empleado\" (ROL003) como base\n");
        credenciales.append("- La contraseña del cliente fue generada automáticamente por el sistema\n");
        credenciales.append("- Para cambiar las credenciales, usar los endpoints de cambio de contraseña/email\n");

        // Guardar credenciales en archivo
        try {
            FileWriter writer = new FileWriter("CREDENCIALES.md");
            writer.write(credenciales.toString());
            writer.close();
            System.out.println("\n✅ Archivo CREDENCIALES.md generado exitosamente");
        } catch (IOException e) {
            System.err.println("❌ Error al generar archivo de credenciales: " + e.getMessage());
        }

        System.out.println("\n========================================");
        System.out.println("✅ Inicialización de datos completada");
        System.out.println("========================================\n");
    }
}