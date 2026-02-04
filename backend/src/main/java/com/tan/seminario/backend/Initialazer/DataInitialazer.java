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
import java.util.*;

@Component
public class DataInitialazer {
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private InmuebleRepository inmuebleRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private EstadoReservaRepository estadoReservaRepository;
    @Autowired
    private TipoMovimientoRepository tipoMovimientoRepository;
    @Autowired
    private TipoTareaRepository tipoTareaRepository;
    @Autowired
    private EstadoTareaRepository estadoTareaRepository;
    @Autowired
    private MonedaRepository monedaRepository;
    @Autowired
    private CategoriaMovimientoRepository categoriaMovimientoRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private CajaMadreRepository cajaMadreRepository;
    @Autowired
    private MovimientoRepository movimientoRepository;
    @Autowired
    private TareaRepository tareaRepository;
    @Autowired
    private EmpleadoRepository empleadoRepository;
    @Autowired
    private EmpleadoCajaRepository empleadoCajaRepository;
    @Autowired
    private InmuebleCajaRepository inmuebleCajaRepository;

    @Autowired
    ExpertoABMEmpleado expertoABMEmpleado;
    @Autowired
    ExpertoABMCliente expertoABMCliente;

    @PostConstruct
    public void initializeData() {


        //Estado Reserva
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

        // Cliente
        if (clienteRepository.count() == 0) {
            Cliente cli1 = new Cliente("44000000","CLI002","Matias",null,LocalDateTime.now());
            Cliente cli2 = new Cliente("44000001","CLI003","Clara",null,LocalDateTime.now());
            Cliente cli3 = new Cliente("44000002","CLI004","Jose",null,LocalDateTime.now());
            Cliente cli4 = new Cliente("44000003","CLI005","Maria",null,LocalDateTime.now());
            Cliente cli5 = new Cliente("44000004","CLI006","Mau",null,LocalDateTime.now());
            Cliente cli6 = new Cliente("44000005","CLI007","Andrea",null,LocalDateTime.now());
            Cliente cli7 = new Cliente("44000006","CLI008","Diego",null,LocalDateTime.now());
            Cliente cli8 = new Cliente("44000007","CLI009","Sofia",null,LocalDateTime.now());
            Cliente cli9 = new Cliente("44000008","CLI010","Lucas",null,LocalDateTime.now());
            Cliente cli10 = new Cliente("44000009","CLI011","Fernanda",null,LocalDateTime.now());

            List<Cliente> clientes = Arrays.asList(cli1, cli2, cli3, cli4, cli5, cli6, cli7, cli8, cli9, cli10);

            for (Cliente cliente : clientes) {
                DTOAltaClienteRequest clienteRequest = DTOAltaClienteRequest.builder()
                        .dniCliente(cliente.getDniCliente())
                        .nombreCliente(cliente.getNombreCliente())
                        .email((cliente.getNombreCliente()+"@gmail.com").toLowerCase())
                        .build();
                DTOAltaClienteResponse clienteResponse = expertoABMCliente.altaCliente(clienteRequest);
            }
        }

        // Inmueble y Cajas Inmueble
        if (inmuebleRepository.count() == 0) {
            Cliente cli1 = clienteRepository.findByDniCliente("44000000").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli2 = clienteRepository.findByDniCliente("44000001").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli3 = clienteRepository.findByDniCliente("44000002").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli4 = clienteRepository.findByDniCliente("44000003").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli5 = clienteRepository.findByDniCliente("44000004").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli6 = clienteRepository.findByDniCliente("44000005").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli7 = clienteRepository.findByDniCliente("44000006").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli8 = clienteRepository.findByDniCliente("44000007").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli9 = clienteRepository.findByDniCliente("44000008").orElseThrow(()->new RuntimeException("ERROR"));
            Cliente cli10 = clienteRepository.findByDniCliente("44000009").orElseThrow(()->new RuntimeException("ERROR"));

            Inmueble in1 = new Inmueble("INM001", "Chacras", 1, 2, 4, "Calle Falsa 123", LocalDateTime.now().minusMonths(8), null, 60.0, 100.0, cli4);
            Inmueble in2 = new Inmueble("INM002", "Godoy", 2, 3, 8, "Av. Mar 456", LocalDateTime.now().minusMonths(7), null, 120.0, 200.0, cli3);
            Inmueble in3 = new Inmueble("INM003", "Montana", 1, 2, 5, "Ruta 7 km 20", LocalDateTime.now().minusMonths(5), null, 80.0, 150.0, cli5);
            Inmueble in4 = new Inmueble("INM004", "Terraoliva", 1, 1, 2, "Edificio Central Piso 5", LocalDateTime.now().minusMonths(9), null, 40.0, 90.0, cli4);
            
            // Más inmuebles - Matias (cli1) con 2 inmuebles
            Inmueble in5 = new Inmueble("INM005", "Chalet", 2, 3, 6, "Av. San Martin 789", LocalDateTime.now().minusMonths(6), null, 100.0, 180.0, cli1);
            Inmueble in6 = new Inmueble("INM006", "Departamento", 1, 1, 3, "Calle Principal 321", LocalDateTime.now().minusMonths(4), null, 50.0, 80.0, cli1);
            
            // Clara (cli2) con 2 inmuebles
            Inmueble in7 = new Inmueble("INM007", "Villa", 3, 4, 10, "Los Andes 555", LocalDateTime.now().minusMonths(3), null, 150.0, 250.0, cli2);
            Inmueble in8 = new Inmueble("INM008", "Bungalow", 1, 2, 4, "Ruta 40 km 50", LocalDateTime.now().minusMonths(11), null, 65.0, 120.0, cli2);
            
            // Jose (cli3) con 2 inmuebles
            Inmueble in9 = new Inmueble("INM009", "Casita", 1, 1, 2, "Camino a la Costa", LocalDateTime.now().minusMonths(2), null, 45.0, 75.0, cli3);
            Inmueble in10 = new Inmueble("INM010", "Finca", 2, 2, 5, "Ruta 9 km 100", LocalDateTime.now().minusMonths(10), null, 90.0, 160.0, cli3);
            
            // Maria (cli4) con otro inmueble adicional
            Inmueble in11 = new Inmueble("INM011", "Mansión", 4, 5, 12, "Av. Rivadavia 999", LocalDateTime.now().minusMonths(1), null, 200.0, 350.0, cli4);
            
            // Andrea (cli6) con 2 inmuebles
            Inmueble in12 = new Inmueble("INM012", "Cottage", 1, 2, 4, "Av. Belgrano 654", LocalDateTime.now().minusMonths(7), null, 70.0, 130.0, cli6);
            Inmueble in13 = new Inmueble("INM013", "Penthouse", 2, 2, 5, "Torre Central Piso 20", LocalDateTime.now().minusMonths(5), null, 110.0, 190.0, cli6);
            
            // Diego (cli7) con 2 inmuebles
            Inmueble in14 = new Inmueble("INM014", "Rancho", 2, 3, 7, "Campo Verde", LocalDateTime.now().minusMonths(8), null, 85.0, 150.0, cli7);
            Inmueble in15 = new Inmueble("INM015", "Studio", 1, 1, 2, "Centro Comercial", LocalDateTime.now().minusMonths(3), null, 40.0, 70.0, cli7);

            InmuebleCaja inmuebleCaja1 = new InmuebleCaja(1L,"Chacras",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(240),null,in1 );
            InmuebleCaja inmuebleCaja2 = new InmuebleCaja(2L,"Godoy",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(210),null,in2 );
            InmuebleCaja inmuebleCaja3 = new InmuebleCaja(3L,"Montana",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(150),null,in3 );
            InmuebleCaja inmuebleCaja4 = new InmuebleCaja(4L,"Terraoliva",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(270),null,in4 );
            InmuebleCaja inmuebleCaja5 = new InmuebleCaja(5L,"Chalet",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(180),null,in5 );
            InmuebleCaja inmuebleCaja6 = new InmuebleCaja(6L,"Departamento",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(120),null,in6 );
            InmuebleCaja inmuebleCaja7 = new InmuebleCaja(7L,"Villa",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(90),null,in7 );
            InmuebleCaja inmuebleCaja8 = new InmuebleCaja(8L,"Bungalow",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(330),null,in8 );
            InmuebleCaja inmuebleCaja9 = new InmuebleCaja(9L,"Casita",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(60),null,in9 );
            InmuebleCaja inmuebleCaja10 = new InmuebleCaja(10L,"Finca",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(300),null,in10 );
            InmuebleCaja inmuebleCaja11 = new InmuebleCaja(11L,"Mansión",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(30),null,in11 );
            InmuebleCaja inmuebleCaja12 = new InmuebleCaja(12L,"Cottage",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(210),null,in12 );
            InmuebleCaja inmuebleCaja13 = new InmuebleCaja(13L,"Penthouse",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(150),null,in13 );
            InmuebleCaja inmuebleCaja14 = new InmuebleCaja(14L,"Rancho",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(240),null,in14 );
            InmuebleCaja inmuebleCaja15 = new InmuebleCaja(15L,"Studio",BigDecimal.valueOf(0.0),BigDecimal.valueOf(0.0),LocalDateTime.now().minusDays(90),null,in15 );
            
            inmuebleRepository.saveAll(Arrays.asList(in1, in2, in3, in4, in5, in6, in7, in8, in9, in10, in11, in12, in13, in14, in15));

            inmuebleCajaRepository.saveAll(Arrays.asList(inmuebleCaja1, inmuebleCaja2, inmuebleCaja3, inmuebleCaja4, inmuebleCaja5, inmuebleCaja6, inmuebleCaja7, inmuebleCaja8, inmuebleCaja9, inmuebleCaja10, inmuebleCaja11, inmuebleCaja12, inmuebleCaja13, inmuebleCaja14, inmuebleCaja15));
        }

        // Reservas
        if (reservaRepository.count() == 0) {
            Inmueble in1 = inmuebleRepository.findByCodInmueble("INM001");
            Inmueble in2 = inmuebleRepository.findByCodInmueble("INM002");
            Inmueble in3 = inmuebleRepository.findByCodInmueble("INM003");
            Inmueble in4 = inmuebleRepository.findByCodInmueble("INM004");
            Inmueble in5 = inmuebleRepository.findByCodInmueble("INM005");
            Inmueble in6 = inmuebleRepository.findByCodInmueble("INM006");
            Inmueble in7 = inmuebleRepository.findByCodInmueble("INM007");
            Inmueble in8 = inmuebleRepository.findByCodInmueble("INM008");
            Inmueble in9 = inmuebleRepository.findByCodInmueble("INM009");
            Inmueble in10 = inmuebleRepository.findByCodInmueble("INM010");
            Inmueble in11 = inmuebleRepository.findByCodInmueble("INM011");
            Inmueble in12 = inmuebleRepository.findByCodInmueble("INM012");
            Inmueble in13 = inmuebleRepository.findByCodInmueble("INM013");
            Inmueble in14 = inmuebleRepository.findByCodInmueble("INM014");
            Inmueble in15 = inmuebleRepository.findByCodInmueble("INM015");

            EstadoReserva estSenada = estadoReservaRepository.findByNombreEstadoReserva("Señada");
            EstadoReserva estPreparada = estadoReservaRepository.findByNombreEstadoReserva("Preparada");
            EstadoReserva estFinalizada = estadoReservaRepository.findByNombreEstadoReserva("Finalizada");
            EstadoReserva estCancelada = estadoReservaRepository.findByNombreEstadoReserva("Cancelada");
            EstadoReserva estEnCurso = estadoReservaRepository.findByNombreEstadoReserva("En Curso");

            // SEÑADA - 5 reservas (fecha de reserva reciente, fechas de check-in futuras)
            Reserva r1 = new Reserva("RES001", LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(7), LocalDateTime.now().minusDays(50), 5, 2,"Clara","261500001","clara@gmail.com", 2500.0, 1000.0, 100.0, "Airbnb","Amable contactar por telefono",Boolean.FALSE, in1, estSenada);
            Reserva r2 = new Reserva("RES002", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(15), LocalDateTime.now().minusDays(10), 5, 4, "Matias", "261500001", "matias@gmail.com", 3500.0, 1500.0, 150.0, "Booking", "",Boolean.FALSE, in2, estSenada);
            Reserva r7 = new Reserva("RES007", LocalDateTime.now().plusDays(5), LocalDateTime.now().plusDays(10), LocalDateTime.now().minusDays(15), 4, 2,"Pedro","261500002","pedro@gmail.com", 2000.0, 800.0, 80.0, "Airbnb","Con piscina",Boolean.FALSE, in5, estSenada);
            Reserva r8 = new Reserva("RES008", LocalDateTime.now().plusDays(12), LocalDateTime.now().plusDays(17), LocalDateTime.now().minusDays(8), 3, 2,"Ana","261500003","ana@gmail.com", 1800.0, 700.0, 70.0, "Directo","Familia",Boolean.FALSE, in6, estSenada);
            Reserva r9 = new Reserva("RES009", LocalDateTime.now().plusDays(15), LocalDateTime.now().plusDays(20), LocalDateTime.now().minusDays(3), 5, 3,"Luis","261500004","luis@gmail.com", 3000.0, 1200.0, 120.0, "Booking","Pareja en luna de miel",Boolean.FALSE, in7, estSenada);

            // PREPARADA - 5 reservas (fechas de check-in próximas, hace poco que se reservaron)
            Reserva r3 = new Reserva("RES003", LocalDateTime.now().plusDays(20), LocalDateTime.now().plusDays(25), LocalDateTime.now().minusDays(2), 5, 3, "Juan", "261500001", "juan@gmail.com", 3000.0, 1200.0, 120.0, "Directo", "Son 3 una familia",Boolean.FALSE, in3, estPreparada);
            Reserva r10 = new Reserva("RES010", LocalDateTime.now().plusDays(3), LocalDateTime.now().plusDays(8), LocalDateTime.now().minusDays(1), 2, 2,"Carlos","261500005","carlos@gmail.com", 1500.0, 600.0, 60.0, "Airbnb","Viaje de trabajo",Boolean.FALSE, in8, estPreparada);
            Reserva r11 = new Reserva("RES011", LocalDateTime.now().plusDays(7), LocalDateTime.now().plusDays(14), LocalDateTime.now().minusDays(4), 6, 4,"Patricia","261500006","patricia@gmail.com", 4000.0, 1600.0, 160.0, "Booking","Grupo de amigos",Boolean.FALSE, in9, estPreparada);
            Reserva r12 = new Reserva("RES012", LocalDateTime.now().plusDays(8), LocalDateTime.now().plusDays(12), LocalDateTime.now().minusDays(5), 3, 2,"Roberto","261500007","roberto@gmail.com", 2200.0, 900.0, 90.0, "Directo","Jubilados",Boolean.FALSE, in10, estPreparada);
            Reserva r13 = new Reserva("RES013", LocalDateTime.now().plusDays(18), LocalDateTime.now().plusDays(23), LocalDateTime.now().minusDays(6), 4, 3,"Sandra","261500008","sandra@gmail.com", 2800.0, 1100.0, 110.0, "Booking","Descanso",Boolean.FALSE, in11, estPreparada);

            // FINALIZADA - 5 reservas (fechas en el pasado, completadas hace tiempo)
            Reserva r4 = new Reserva("RES004", LocalDateTime.now().minusDays(30), LocalDateTime.now().minusDays(25), LocalDateTime.now().minusDays(80), 5, 2, "Fernando", "261500001", "fernando@gmail.com", 2200.0, 800.0, 800.0, "Airbnb", "Contactar por mail",Boolean.FALSE, in4, estFinalizada);
            Reserva r14 = new Reserva("RES014", LocalDateTime.now().minusDays(60), LocalDateTime.now().minusDays(54), LocalDateTime.now().minusDays(100), 4, 3,"Miguel","261500009","miguel@gmail.com", 2600.0, 1000.0, 100.0, "Booking","Vacaciones",Boolean.FALSE, in12, estFinalizada);
            Reserva r15 = new Reserva("RES015", LocalDateTime.now().minusDays(45), LocalDateTime.now().minusDays(40), LocalDateTime.now().minusDays(90), 5, 2,"Gabriela","261500010","gabriela@gmail.com", 3100.0, 1250.0, 125.0, "Directo","Familia grande",Boolean.FALSE, in13, estFinalizada);
            Reserva r16 = new Reserva("RES016", LocalDateTime.now().minusDays(75), LocalDateTime.now().minusDays(70), LocalDateTime.now().minusDays(120), 3, 2,"Eduardo","261500011","eduardo@gmail.com", 1900.0, 750.0, 75.0, "Airbnb","Negocio",Boolean.FALSE, in14, estFinalizada);
            Reserva r17 = new Reserva("RES017", LocalDateTime.now().minusDays(50), LocalDateTime.now().minusDays(45), LocalDateTime.now().minusDays(95), 6, 4,"Valeria","261500012","valeria@gmail.com", 3500.0, 1400.0, 140.0, "Booking","Corporativo",Boolean.FALSE, in15, estFinalizada);

            // FINALIZADAS 2024 (fechas en 2024)
            Reserva r26 = new Reserva("RES026", LocalDateTime.of(2024, 3, 12, 14, 0), LocalDateTime.of(2024, 3, 17, 10, 0), LocalDateTime.of(2024, 2, 20, 9, 30), 5, 2, "Marta", "261500021", "marta@gmail.com", 2100.0, 800.0, 80.0, "Airbnb", "Viaje familiar", Boolean.FALSE, in1, estFinalizada);
            Reserva r27 = new Reserva("RES027", LocalDateTime.of(2024, 7, 5, 15, 0), LocalDateTime.of(2024, 7, 10, 11, 0), LocalDateTime.of(2024, 6, 1, 12, 0), 5, 3, "Sergio", "261500022", "sergio@gmail.com", 2800.0, 1100.0, 110.0, "Booking", "Vacaciones", Boolean.FALSE, in3, estFinalizada);
            Reserva r28 = new Reserva("RES028", LocalDateTime.of(2024, 11, 2, 13, 0), LocalDateTime.of(2024, 11, 6, 10, 0), LocalDateTime.of(2024, 10, 10, 16, 0), 4, 2, "Carla", "261500023", "carla@gmail.com", 1900.0, 700.0, 70.0, "Directo", "Escapada", Boolean.FALSE, in5, estFinalizada);

            // FINALIZADAS 2025 (fechas en 2025)
            Reserva r29 = new Reserva("RES029", LocalDateTime.of(2025, 1, 18, 14, 0), LocalDateTime.of(2025, 1, 23, 10, 0), LocalDateTime.of(2024, 12, 20, 9, 0), 5, 2, "Nadia", "261500024", "nadia@gmail.com", 2300.0, 900.0, 90.0, "Airbnb", "Verano", Boolean.FALSE, in6, estFinalizada);
            Reserva r30 = new Reserva("RES030", LocalDateTime.of(2025, 5, 3, 15, 0), LocalDateTime.of(2025, 5, 8, 11, 0), LocalDateTime.of(2025, 4, 12, 10, 0), 5, 4, "Pablo", "261500025", "pablo@gmail.com", 3200.0, 1250.0, 125.0, "Booking", "Reunión", Boolean.FALSE, in8, estFinalizada);
            Reserva r31 = new Reserva("RES031", LocalDateTime.of(2025, 9, 14, 13, 0), LocalDateTime.of(2025, 9, 18, 10, 0), LocalDateTime.of(2025, 8, 20, 14, 0), 4, 3, "Lucia", "261500026", "lucia@gmail.com", 2600.0, 1000.0, 100.0, "Directo", "Descanso", Boolean.FALSE, in10, estFinalizada);

            // FINALIZADAS 2026 (lo que va del año)
            Reserva r32 = new Reserva("RES032", LocalDateTime.of(2026, 1, 6, 14, 0), LocalDateTime.of(2026, 1, 10, 10, 0), LocalDateTime.of(2025, 12, 15, 9, 0), 4, 2, "Brenda", "261500027", "brenda@gmail.com", 2000.0, 780.0, 78.0, "Airbnb", "Inicio de año", Boolean.FALSE, in11, estFinalizada);
            Reserva r33 = new Reserva("RES033", LocalDateTime.of(2026, 1, 20, 15, 0), LocalDateTime.of(2026, 1, 24, 10, 0), LocalDateTime.of(2026, 1, 5, 12, 0), 4, 3, "Oscar", "261500028", "oscar@gmail.com", 2700.0, 1050.0, 105.0, "Booking", "Trabajo", Boolean.FALSE, in12, estFinalizada);
            Reserva r34 = new Reserva("RES034", LocalDateTime.of(2026, 2, 1, 14, 0), LocalDateTime.of(2026, 2, 4, 10, 0), LocalDateTime.of(2026, 1, 12, 11, 0), 3, 2, "Florencia", "261500029", "florencia@gmail.com", 1800.0, 700.0, 70.0, "Directo", "Corto", Boolean.FALSE, in13, estFinalizada);

            // CANCELADA - 5 reservas (fechas en el pasado, sin llegar a completarse)
            Reserva r5 = new Reserva("RES005", LocalDateTime.now().plusDays(40), LocalDateTime.now().plusDays(45), LocalDateTime.now().minusDays(10), 5, 2, "Nico", "261500001", "nico@gmail.com", 2700.0, 900.0, 90.0, "Booking", "Pareja",Boolean.FALSE, in1, estCancelada);
            Reserva r18 = new Reserva("RES018", LocalDateTime.now().minusDays(20), LocalDateTime.now().minusDays(15), LocalDateTime.now().minusDays(50), 2, 2,"Javier","261500013","javier@gmail.com", 1400.0, 550.0, 55.0, "Airbnb","Cancelada por enfermedad",Boolean.FALSE, in2, estCancelada);
            Reserva r19 = new Reserva("RES019", LocalDateTime.now().minusDays(35), LocalDateTime.now().minusDays(30), LocalDateTime.now().minusDays(70), 4, 3,"Mariana","261500014","mariana@gmail.com", 2400.0, 950.0, 95.0, "Directo","Cancelada por viaje",Boolean.FALSE, in3, estCancelada);
            Reserva r20 = new Reserva("RES020", LocalDateTime.now().minusDays(10), LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(30), 3, 2,"Andres","261500015","andres@gmail.com", 1700.0, 680.0, 68.0, "Booking","Cancelada",Boolean.FALSE, in5, estCancelada);
            Reserva r21 = new Reserva("RES021", LocalDateTime.now().minusDays(55), LocalDateTime.now().minusDays(50), LocalDateTime.now().minusDays(110), 5, 3,"Victoria","261500016","victoria@gmail.com", 3200.0, 1300.0, 130.0, "Airbnb","Cancelada",Boolean.FALSE, in6, estCancelada);

            // EN CURSO - 5 reservas (fechas actuales/presentes)
            Reserva r6 = new Reserva("RES006",LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(7), LocalDateTime.now().minusDays(60), 8, 3, "Ruben", "261500001", "ruben@gmail.com", 3200.0, 900.0, 90.0, "Booking", "Familia",Boolean.TRUE, in3, estEnCurso);
            Reserva r22 = new Reserva("RES022", LocalDateTime.now().minusDays(2), LocalDateTime.now().plusDays(5), LocalDateTime.now().minusDays(40), 4, 2,"Alfredo","261500017","alfredo@gmail.com", 2300.0, 920.0, 92.0, "Directo","En progreso",Boolean.TRUE, in7, estEnCurso);
            Reserva r23 = new Reserva("RES023", LocalDateTime.now().minusDays(3), LocalDateTime.now().plusDays(4), LocalDateTime.now().minusDays(35), 5, 3,"Lorena","261500018","lorena@gmail.com", 2900.0, 1150.0, 115.0, "Booking","En progreso",Boolean.TRUE, in8, estEnCurso);
            Reserva r24 = new Reserva("RES024", LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(6), LocalDateTime.now().minusDays(45), 3, 2,"Ricardo","261500019","ricardo@gmail.com", 1800.0, 720.0, 72.0, "Airbnb","En progreso",Boolean.TRUE, in9, estEnCurso);
            Reserva r25 = new Reserva("RES025", LocalDateTime.now().minusDays(4), LocalDateTime.now().plusDays(3), LocalDateTime.now().minusDays(55), 6, 4,"Daniela","261500020","daniela@gmail.com", 3400.0, 1360.0, 136.0, "Booking","Grupo en progreso",Boolean.TRUE, in10, estEnCurso);

            reservaRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34));
        }


        //Tipo Movimiento
        if (tipoMovimientoRepository.count() == 0) {
            TipoMovimiento tipo1 = new TipoMovimiento("TI001", "Ingreso", null, LocalDateTime.now());
            TipoMovimiento tipo2 = new TipoMovimiento("TI002", "Egreso", null, LocalDateTime.now());

            tipoMovimientoRepository.saveAll(Arrays.asList(tipo1, tipo2));
            System.out.println("Datos iniciales de TipoMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de TipoMovimiento, no se inicializaron nuevos datos.");
        }

        //Tipo Tarea
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


        //Estado Tarea
        if (estadoTareaRepository.count() == 0) {
            EstadoTarea estadoTarea1 = new EstadoTarea( "EST001", "Asignada", null, LocalDateTime.now());
            EstadoTarea estadoTarea2 = new EstadoTarea( "EST002", "Anulada", null, LocalDateTime.now());
            EstadoTarea estadoTarea3 = new EstadoTarea( "EST003", "Finalizada", null, LocalDateTime.now());

            estadoTareaRepository.saveAll(Arrays.asList(estadoTarea1, estadoTarea2, estadoTarea3));
            System.out.println("Datos iniciales de EstadoTarea insertados correctamente.");

        } else {
            System.out.println("La base de datos ya contiene datos de EstadoTarea, no se inicializaron nuevos datos.");
        }


        //Moneda
        if (monedaRepository.count() == 0) {
            Moneda moneda1 = new Moneda( "MON001", "Peso Argentino", LocalDateTime.now(), null);
            Moneda moneda2 = new Moneda( "MON002", "Dolar", LocalDateTime.now(), null);

            monedaRepository.saveAll(Arrays.asList(moneda1, moneda2));
            System.out.println("Datos iniciales de Moneda insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de Moneda, no se inicializaron nuevos datos.");
        }


        //Categoria Movimiento
        if (categoriaMovimientoRepository.count() == 0) {

            CategoriaMovimiento categoriaMovimiento1 = new CategoriaMovimiento( "CAT001", "Seña", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento2 = new CategoriaMovimiento("CAT002", "Sueldo", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento3 = new CategoriaMovimiento( "CAT003", "Cancelacion Reserva", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento4 = new CategoriaMovimiento( "CAT004", "Rendicion a Inmueble", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento5 = new CategoriaMovimiento( "CAT005", "Rendicion de Empleado", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento6 = new CategoriaMovimiento( "CAT006", "Otros", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento7 = new CategoriaMovimiento( "CAT007", "Cambio Moneda", LocalDateTime.now(), null);

            categoriaMovimientoRepository.saveAll(Arrays.asList(categoriaMovimiento1, categoriaMovimiento2, categoriaMovimiento3, categoriaMovimiento4, categoriaMovimiento5, categoriaMovimiento6, categoriaMovimiento7));
            System.out.println("Datos iniciales de CategoriaMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de CategoriaMovimiento, no se inicializaron nuevos datos.");
        }


        //Rol
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

        //Caja Madre
        if (cajaMadreRepository.count() == 0) {
            CajaMadre cajaMadre = CajaMadre.builder()
                    .nroCajaMadre(1L)
                    .nombreCajaMadre("Caja Madre")
                    .balanceTotalARS(BigDecimal.valueOf(1530250.0))
                    .balanceTotalUSD(BigDecimal.valueOf(8250.0))
                    .fechaHoraAltaCajaMadre(LocalDateTime.now())
                    .build();

            cajaMadreRepository.save(cajaMadre);
            System.out.println("Datos iniciales de CajaMadre insertados correctamente.");
        }

        //Empleado y Usuarios
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
        }

        //Movimientos
        if (movimientoRepository.count() == 0) {
            TipoMovimiento ingreso = tipoMovimientoRepository.findByCodTipoMovimiento("TI001");
            TipoMovimiento egreso = tipoMovimientoRepository.findByCodTipoMovimiento("TI002");

            CategoriaMovimiento senia = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Seña");
            CategoriaMovimiento sueldo = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Sueldo");
            CategoriaMovimiento cancelacionReserva = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Cancelacion Reserva");
            CategoriaMovimiento rendicionInmueble = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Rendicion a Inmueble");
            CategoriaMovimiento rendicionEmpleado = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Rendicion de Empleado");
            CategoriaMovimiento otros = categoriaMovimientoRepository.findBynombreCategoriaMovimiento("Otros");

            Moneda Ars = monedaRepository.findBynombreMoneda("Peso Argentino");
            Moneda Dolar = monedaRepository.findBynombreMoneda("Dolar");

            CajaMadre cajaMadre = cajaMadreRepository.findByNroCajaMadre(1L);
            
            EmpleadoCaja cajaEmpleado1 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("44564456").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado2 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("22222222").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado3 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("33333333").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado4 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("44444444").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado5 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("55555555").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado6 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("66666666").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado7 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("77777777").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado8 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("88888888").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado9 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("99999999").orElseThrow(()->new RuntimeException("ERROR")));
            EmpleadoCaja cajaEmpleado10 = empleadoCajaRepository.findByEmpleado(empleadoRepository.findByDniEmpleado("10101010").orElseThrow(()->new RuntimeException("ERROR")));

            InmuebleCaja inmuebleCaja1 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM001"));
            InmuebleCaja inmuebleCaja2 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM002"));
            InmuebleCaja inmuebleCaja3 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM003"));
            InmuebleCaja inmuebleCaja4 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM004"));
            InmuebleCaja inmuebleCaja5 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM005"));
            InmuebleCaja inmuebleCaja6 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM006"));
            InmuebleCaja inmuebleCaja7 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM007"));
            InmuebleCaja inmuebleCaja8 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM008"));
            InmuebleCaja inmuebleCaja9 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM009"));
            InmuebleCaja inmuebleCaja10 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM010"));
            InmuebleCaja inmuebleCaja11 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM011"));
            InmuebleCaja inmuebleCaja12 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM012"));
            InmuebleCaja inmuebleCaja13 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM013"));
            InmuebleCaja inmuebleCaja14 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM014"));
            InmuebleCaja inmuebleCaja15 = inmuebleCajaRepository.findByInmueble(inmuebleRepository.findByCodInmueble("INM015"));

            List<Reserva> reserva1 = reservaRepository.findByCodReserva("RES001");
            List<Reserva> reserva2 = reservaRepository.findByCodReserva("RES002");
            List<Reserva> reserva3 = reservaRepository.findByCodReserva("RES003");
            List<Reserva> reserva4 = reservaRepository.findByCodReserva("RES004");
            List<Reserva> reserva5 = reservaRepository.findByCodReserva("RES005");
            List<Reserva> reserva6 = reservaRepository.findByCodReserva("RES006");
            List<Reserva> reserva7 = reservaRepository.findByCodReserva("RES007");
            List<Reserva> reserva8 = reservaRepository.findByCodReserva("RES008");
            List<Reserva> reserva9 = reservaRepository.findByCodReserva("RES009");
            List<Reserva> reserva10 = reservaRepository.findByCodReserva("RES010");
            List<Reserva> reserva11 = reservaRepository.findByCodReserva("RES011");
            List<Reserva> reserva12 = reservaRepository.findByCodReserva("RES012");
            List<Reserva> reserva13 = reservaRepository.findByCodReserva("RES013");
            List<Reserva> reserva14 = reservaRepository.findByCodReserva("RES014");
            List<Reserva> reserva15 = reservaRepository.findByCodReserva("RES015");
            List<Reserva> reserva16 = reservaRepository.findByCodReserva("RES016");
            List<Reserva> reserva17 = reservaRepository.findByCodReserva("RES017");
            List<Reserva> reserva18 = reservaRepository.findByCodReserva("RES018");
            List<Reserva> reserva19 = reservaRepository.findByCodReserva("RES019");
            List<Reserva> reserva20 = reservaRepository.findByCodReserva("RES020");
            List<Reserva> reserva21 = reservaRepository.findByCodReserva("RES021");
            List<Reserva> reserva22 = reservaRepository.findByCodReserva("RES022");
            List<Reserva> reserva23 = reservaRepository.findByCodReserva("RES023");
            List<Reserva> reserva24 = reservaRepository.findByCodReserva("RES024");
            List<Reserva> reserva25 = reservaRepository.findByCodReserva("RES025");

            // INGRESOS POR SEÑA - 25 movimientos en DÓLARES (una por cada reserva)
            Movimiento mov1 = new Movimiento(1L,null,100.0,LocalDateTime.now().minusDays(50),ingreso,senia,Dolar,cajaMadre,null,null,reserva1.get(0),null);
            Movimiento mov2 = new Movimiento(2L,null,150.0,LocalDateTime.now().minusDays(10),ingreso,senia,Dolar,cajaMadre,null,null,reserva2.get(0),null);
            Movimiento mov3 = new Movimiento(3L,null,120.0,LocalDateTime.now().minusDays(2),ingreso,senia,Dolar,cajaMadre,null,null,reserva3.get(0),null);
            Movimiento mov4 = new Movimiento(4L,null,90.0,LocalDateTime.now().minusDays(80),ingreso,senia,Dolar,cajaMadre,null,null,reserva4.get(0),null);
            Movimiento mov5 = new Movimiento(5L,null,90.0,LocalDateTime.now().minusDays(10),ingreso,senia,Dolar,cajaMadre,null,null,reserva5.get(0),null);
            Movimiento mov6 = new Movimiento(6L,null,90.0,LocalDateTime.now().minusDays(60),ingreso,senia,Dolar,cajaMadre,null,null,reserva6.get(0),null);
            Movimiento mov7 = new Movimiento(7L,null,80.0,LocalDateTime.now().minusDays(15),ingreso,senia,Dolar,cajaMadre,null,null,reserva7.get(0),null);
            Movimiento mov8 = new Movimiento(8L,null,70.0,LocalDateTime.now().minusDays(8),ingreso,senia,Dolar,cajaMadre,null,null,reserva8.get(0),null);
            Movimiento mov9 = new Movimiento(9L,null,120.0,LocalDateTime.now().minusDays(3),ingreso,senia,Dolar,cajaMadre,null,null,reserva9.get(0),null);
            Movimiento mov10 = new Movimiento(10L,null,60.0,LocalDateTime.now().minusDays(1),ingreso,senia,Dolar,cajaMadre,null,null,reserva10.get(0),null);
            Movimiento mov11 = new Movimiento(11L,null,160.0,LocalDateTime.now().minusDays(4),ingreso,senia,Dolar,cajaMadre,null,null,reserva11.get(0),null);
            Movimiento mov12 = new Movimiento(12L,null,90.0,LocalDateTime.now().minusDays(5),ingreso,senia,Dolar,cajaMadre,null,null,reserva12.get(0),null);
            Movimiento mov13 = new Movimiento(13L,null,110.0,LocalDateTime.now().minusDays(6),ingreso,senia,Dolar,cajaMadre,null,null,reserva13.get(0),null);
            Movimiento mov14 = new Movimiento(14L,null,100.0,LocalDateTime.now().minusDays(100),ingreso,senia,Dolar,cajaMadre,null,null,reserva14.get(0),null);
            Movimiento mov15 = new Movimiento(15L,null,125.0,LocalDateTime.now().minusDays(90),ingreso,senia,Dolar,cajaMadre,null,null,reserva15.get(0),null);
            Movimiento mov16 = new Movimiento(16L,null,75.0,LocalDateTime.now().minusDays(120),ingreso,senia,Dolar,cajaMadre,null,null,reserva16.get(0),null);
            Movimiento mov17 = new Movimiento(17L,null,140.0,LocalDateTime.now().minusDays(95),ingreso,senia,Dolar,cajaMadre,null,null,reserva17.get(0),null);
            Movimiento mov18 = new Movimiento(18L,null,55.0,LocalDateTime.now().minusDays(50),ingreso,senia,Dolar,cajaMadre,null,null,reserva18.get(0),null);
            Movimiento mov19 = new Movimiento(19L,null,95.0,LocalDateTime.now().minusDays(70),ingreso,senia,Dolar,cajaMadre,null,null,reserva19.get(0),null);
            Movimiento mov20 = new Movimiento(20L,null,68.0,LocalDateTime.now().minusDays(30),ingreso,senia,Dolar,cajaMadre,null,null,reserva20.get(0),null);
            Movimiento mov21 = new Movimiento(21L,null,130.0,LocalDateTime.now().minusDays(110),ingreso,senia,Dolar,cajaMadre,null,null,reserva21.get(0),null);
            Movimiento mov22 = new Movimiento(22L,null,92.0,LocalDateTime.now().minusDays(40),ingreso,senia,Dolar,cajaMadre,null,null,reserva22.get(0),null);
            Movimiento mov23 = new Movimiento(23L,null,115.0,LocalDateTime.now().minusDays(35),ingreso,senia,Dolar,cajaMadre,null,null,reserva23.get(0),null);
            Movimiento mov24 = new Movimiento(24L,null,72.0,LocalDateTime.now().minusDays(45),ingreso,senia,Dolar,cajaMadre,null,null,reserva24.get(0),null);
            Movimiento mov25 = new Movimiento(25L,null,136.0,LocalDateTime.now().minusDays(55),ingreso,senia,Dolar,cajaMadre,null,null,reserva25.get(0),null);

            // SUELDOS - EGRESO CAJA MADRE + INGRESO CAJA EMPLEADO
            Movimiento mov26 = new Movimiento(26L,null,200000.0,LocalDateTime.now().minusDays(30),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov27 = new Movimiento(27L,null,400000.0,LocalDateTime.now().minusDays(25),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov28 = new Movimiento(28L,null,350000.0,LocalDateTime.now().minusDays(20),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov29 = new Movimiento(29L,null,300000.0,LocalDateTime.now().minusDays(15),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov30 = new Movimiento(30L,null,380000.0,LocalDateTime.now().minusDays(10),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov31 = new Movimiento(31L,null,450000.0,LocalDateTime.now().minusDays(8),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov32 = new Movimiento(32L,null,420000.0,LocalDateTime.now().minusDays(7),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov33 = new Movimiento(33L,null,380000.0,LocalDateTime.now().minusDays(6),egreso,sueldo,Ars,cajaMadre,null,null,null,null);
            Movimiento mov34 = new Movimiento(34L,null,470000.0,LocalDateTime.now().minusDays(5),egreso,sueldo,Ars,cajaMadre,null,null,null,null);

            Movimiento mov65 = new Movimiento(65L,null,200000.0,LocalDateTime.now().minusDays(30),ingreso,sueldo,Ars,null,null,cajaEmpleado2,null,null);
            Movimiento mov66 = new Movimiento(66L,null,400000.0,LocalDateTime.now().minusDays(25),ingreso,sueldo,Ars,null,null,cajaEmpleado3,null,null);
            Movimiento mov67 = new Movimiento(67L,null,350000.0,LocalDateTime.now().minusDays(20),ingreso,sueldo,Ars,null,null,cajaEmpleado4,null,null);
            Movimiento mov68 = new Movimiento(68L,null,300000.0,LocalDateTime.now().minusDays(15),ingreso,sueldo,Ars,null,null,cajaEmpleado5,null,null);
            Movimiento mov69 = new Movimiento(69L,null,380000.0,LocalDateTime.now().minusDays(10),ingreso,sueldo,Ars,null,null,cajaEmpleado6,null,null);
            Movimiento mov70 = new Movimiento(70L,null,450000.0,LocalDateTime.now().minusDays(8),ingreso,sueldo,Ars,null,null,cajaEmpleado7,null,null);
            Movimiento mov71 = new Movimiento(71L,null,420000.0,LocalDateTime.now().minusDays(7),ingreso,sueldo,Ars,null,null,cajaEmpleado8,null,null);
            Movimiento mov72 = new Movimiento(72L,null,380000.0,LocalDateTime.now().minusDays(6),ingreso,sueldo,Ars,null,null,cajaEmpleado9,null,null);
            Movimiento mov73 = new Movimiento(73L,null,470000.0,LocalDateTime.now().minusDays(5),ingreso,sueldo,Ars,null,null,cajaEmpleado10,null,null);

            // RENDICIÓN INMUEBLES USD - EGRESO CAJA MADRE + INGRESO CAJA INMUEBLE
            Movimiento mov35 = new Movimiento(35L,null,200.0,LocalDateTime.now().minusDays(80),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov36 = new Movimiento(36L,null,300.0,LocalDateTime.now().minusDays(60),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov37 = new Movimiento(37L,null,150.0,LocalDateTime.now().minusDays(40),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov38 = new Movimiento(38L,null,400.0,LocalDateTime.now().minusDays(20),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov39 = new Movimiento(39L,null,250.0,LocalDateTime.now().minusDays(55),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov40 = new Movimiento(40L,null,180.0,LocalDateTime.now().minusDays(35),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov41 = new Movimiento(41L,null,350.0,LocalDateTime.now().minusDays(65),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov42 = new Movimiento(42L,null,220.0,LocalDateTime.now().minusDays(75),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov43 = new Movimiento(43L,null,120.0,LocalDateTime.now().minusDays(25),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov44 = new Movimiento(44L,null,280.0,LocalDateTime.now().minusDays(70),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov45 = new Movimiento(45L,null,450.0,LocalDateTime.now().minusDays(15),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov46 = new Movimiento(46L,null,190.0,LocalDateTime.now().minusDays(50),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov47 = new Movimiento(47L,null,310.0,LocalDateTime.now().minusDays(45),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov48 = new Movimiento(48L,null,260.0,LocalDateTime.now().minusDays(85),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);
            Movimiento mov49 = new Movimiento(49L,null,170.0,LocalDateTime.now().minusDays(30),egreso,rendicionInmueble,Dolar,cajaMadre,null,null,null,null);

            Movimiento mov74 = new Movimiento(74L,null,200.0,LocalDateTime.now().minusDays(80),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja1,null,null,null);
            Movimiento mov75 = new Movimiento(75L,null,300.0,LocalDateTime.now().minusDays(60),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja2,null,null,null);
            Movimiento mov76 = new Movimiento(76L,null,150.0,LocalDateTime.now().minusDays(40),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja3,null,null,null);
            Movimiento mov77 = new Movimiento(77L,null,400.0,LocalDateTime.now().minusDays(20),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja4,null,null,null);
            Movimiento mov78 = new Movimiento(78L,null,250.0,LocalDateTime.now().minusDays(55),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja5,null,null,null);
            Movimiento mov79 = new Movimiento(79L,null,180.0,LocalDateTime.now().minusDays(35),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja6,null,null,null);
            Movimiento mov80 = new Movimiento(80L,null,350.0,LocalDateTime.now().minusDays(65),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja7,null,null,null);
            Movimiento mov81 = new Movimiento(81L,null,220.0,LocalDateTime.now().minusDays(75),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja8,null,null,null);
            Movimiento mov82 = new Movimiento(82L,null,120.0,LocalDateTime.now().minusDays(25),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja9,null,null,null);
            Movimiento mov83 = new Movimiento(83L,null,280.0,LocalDateTime.now().minusDays(70),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja10,null,null,null);
            Movimiento mov84 = new Movimiento(84L,null,450.0,LocalDateTime.now().minusDays(15),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja11,null,null,null);
            Movimiento mov85 = new Movimiento(85L,null,190.0,LocalDateTime.now().minusDays(50),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja12,null,null,null);
            Movimiento mov86 = new Movimiento(86L,null,310.0,LocalDateTime.now().minusDays(45),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja13,null,null,null);
            Movimiento mov87 = new Movimiento(87L,null,260.0,LocalDateTime.now().minusDays(85),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja14,null,null,null);
            Movimiento mov88 = new Movimiento(88L,null,170.0,LocalDateTime.now().minusDays(30),ingreso,rendicionInmueble,Dolar,null,inmuebleCaja15,null,null,null);

            // RENDICIÓN INMUEBLES ARS - EGRESO CAJA MADRE + INGRESO CAJA INMUEBLE
            Movimiento mov50 = new Movimiento(50L,null,80000.0,LocalDateTime.now().minusDays(80),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov51 = new Movimiento(51L,null,120000.0,LocalDateTime.now().minusDays(60),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov52 = new Movimiento(52L,null,95000.0,LocalDateTime.now().minusDays(40),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov53 = new Movimiento(53L,null,200000.0,LocalDateTime.now().minusDays(20),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov54 = new Movimiento(54L,null,150000.0,LocalDateTime.now().minusDays(55),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov55 = new Movimiento(55L,null,110000.0,LocalDateTime.now().minusDays(35),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov56 = new Movimiento(56L,null,180000.0,LocalDateTime.now().minusDays(65),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov57 = new Movimiento(57L,null,140000.0,LocalDateTime.now().minusDays(75),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov58 = new Movimiento(58L,null,75000.0,LocalDateTime.now().minusDays(25),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov59 = new Movimiento(59L,null,165000.0,LocalDateTime.now().minusDays(70),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov60 = new Movimiento(60L,null,250000.0,LocalDateTime.now().minusDays(15),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov61 = new Movimiento(61L,null,130000.0,LocalDateTime.now().minusDays(50),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov62 = new Movimiento(62L,null,175000.0,LocalDateTime.now().minusDays(45),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov63 = new Movimiento(63L,null,145000.0,LocalDateTime.now().minusDays(85),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);
            Movimiento mov64 = new Movimiento(64L,null,105000.0,LocalDateTime.now().minusDays(30),egreso,rendicionInmueble,Ars,cajaMadre,null,null,null,null);

            Movimiento mov89 = new Movimiento(89L,null,80000.0,LocalDateTime.now().minusDays(80),ingreso,rendicionInmueble,Ars,null,inmuebleCaja1,null,null,null);
            Movimiento mov90 = new Movimiento(90L,null,120000.0,LocalDateTime.now().minusDays(60),ingreso,rendicionInmueble,Ars,null,inmuebleCaja2,null,null,null);
            Movimiento mov91 = new Movimiento(91L,null,95000.0,LocalDateTime.now().minusDays(40),ingreso,rendicionInmueble,Ars,null,inmuebleCaja3,null,null,null);
            Movimiento mov92 = new Movimiento(92L,null,200000.0,LocalDateTime.now().minusDays(20),ingreso,rendicionInmueble,Ars,null,inmuebleCaja4,null,null,null);
            Movimiento mov93 = new Movimiento(93L,null,150000.0,LocalDateTime.now().minusDays(55),ingreso,rendicionInmueble,Ars,null,inmuebleCaja5,null,null,null);
            Movimiento mov94 = new Movimiento(94L,null,110000.0,LocalDateTime.now().minusDays(35),ingreso,rendicionInmueble,Ars,null,inmuebleCaja6,null,null,null);
            Movimiento mov95 = new Movimiento(95L,null,180000.0,LocalDateTime.now().minusDays(65),ingreso,rendicionInmueble,Ars,null,inmuebleCaja7,null,null,null);
            Movimiento mov96 = new Movimiento(96L,null,140000.0,LocalDateTime.now().minusDays(75),ingreso,rendicionInmueble,Ars,null,inmuebleCaja8,null,null,null);
            Movimiento mov97 = new Movimiento(97L,null,75000.0,LocalDateTime.now().minusDays(25),ingreso,rendicionInmueble,Ars,null,inmuebleCaja9,null,null,null);
            Movimiento mov98 = new Movimiento(98L,null,165000.0,LocalDateTime.now().minusDays(70),ingreso,rendicionInmueble,Ars,null,inmuebleCaja10,null,null,null);
            Movimiento mov99 = new Movimiento(99L,null,250000.0,LocalDateTime.now().minusDays(15),ingreso,rendicionInmueble,Ars,null,inmuebleCaja11,null,null,null);
            Movimiento mov100 = new Movimiento(100L,null,130000.0,LocalDateTime.now().minusDays(50),ingreso,rendicionInmueble,Ars,null,inmuebleCaja12,null,null,null);
            Movimiento mov101 = new Movimiento(101L,null,175000.0,LocalDateTime.now().minusDays(45),ingreso,rendicionInmueble,Ars,null,inmuebleCaja13,null,null,null);
            Movimiento mov102 = new Movimiento(102L,null,145000.0,LocalDateTime.now().minusDays(85),ingreso,rendicionInmueble,Ars,null,inmuebleCaja14,null,null,null);
            Movimiento mov103 = new Movimiento(103L,null,105000.0,LocalDateTime.now().minusDays(30),ingreso,rendicionInmueble,Ars,null,inmuebleCaja15,null,null,null);

                movimientoRepository.saveAll(Arrays.asList(
                    mov1, mov2, mov3, mov4, mov5, mov6, mov7, mov8, mov9, mov10,
                    mov11, mov12, mov13, mov14, mov15, mov16, mov17, mov18, mov19, mov20,
                    mov21, mov22, mov23, mov24, mov25,
                    mov26, mov27, mov28, mov29, mov30, mov31, mov32, mov33, mov34,
                    mov65, mov66, mov67, mov68, mov69, mov70, mov71, mov72, mov73,
                    mov35, mov36, mov37, mov38, mov39, mov40, mov41, mov42, mov43, mov44,
                    mov45, mov46, mov47, mov48, mov49,
                    mov74, mov75, mov76, mov77, mov78, mov79, mov80, mov81, mov82, mov83,
                    mov84, mov85, mov86, mov87, mov88,
                    mov50, mov51, mov52, mov53, mov54, mov55, mov56, mov57, mov58, mov59,
                    mov60, mov61, mov62, mov63, mov64,
                    mov89, mov90, mov91, mov92, mov93, mov94, mov95, mov96, mov97, mov98,
                    mov99, mov100, mov101, mov102, mov103
                ));

            // ACTUALIZAR BALANCES DE TODAS LAS CAJAS SEGÚN LOS MOVIMIENTOS
            List<Movimiento> todosMovimientos = Arrays.asList(
                mov1, mov2, mov3, mov4, mov5, mov6, mov7, mov8, mov9, mov10,
                mov11, mov12, mov13, mov14, mov15, mov16, mov17, mov18, mov19, mov20,
                mov21, mov22, mov23, mov24, mov25,
                mov26, mov27, mov28, mov29, mov30, mov31, mov32, mov33, mov34,
                mov65, mov66, mov67, mov68, mov69, mov70, mov71, mov72, mov73,
                mov35, mov36, mov37, mov38, mov39, mov40, mov41, mov42, mov43, mov44,
                mov45, mov46, mov47, mov48, mov49,
                mov74, mov75, mov76, mov77, mov78, mov79, mov80, mov81, mov82, mov83,
                mov84, mov85, mov86, mov87, mov88,
                mov50, mov51, mov52, mov53, mov54, mov55, mov56, mov57, mov58, mov59,
                mov60, mov61, mov62, mov63, mov64,
                mov89, mov90, mov91, mov92, mov93, mov94, mov95, mov96, mov97, mov98,
                mov99, mov100, mov101, mov102, mov103
            );

            // Obtener balance inicial de caja madre
            BigDecimal cajaMadreARS = cajaMadre.getBalanceTotalARS();
            BigDecimal cajaMadreUSD = cajaMadre.getBalanceTotalUSD();

            // Maps para acumular balances de empleados e inmuebles
            Map<Long, BigDecimal> balancesEmpleadosARS = new HashMap<>();
            Map<Long, BigDecimal> balancesEmpleadosUSD = new HashMap<>();
            Map<Long, BigDecimal> balancesInmueblesARS = new HashMap<>();
            Map<Long, BigDecimal> balancesInmueblesUSD = new HashMap<>();

            // Procesar cada movimiento
            for (Movimiento mov : todosMovimientos) {
                boolean esIngreso = mov.getTipoMovimiento().getCodTipoMovimiento().equals("TI001");
                boolean esARS = mov.getMoneda().getNombreMoneda().equals("Peso Argentino");
                BigDecimal monto = BigDecimal.valueOf(mov.getMontoMovimiento());

                // Procesar según la caja asociada
                if (mov.getCajaMadre() != null) {
                    if (esARS) {
                        cajaMadreARS = esIngreso ? cajaMadreARS.add(monto) : cajaMadreARS.subtract(monto);
                    } else {
                        cajaMadreUSD = esIngreso ? cajaMadreUSD.add(monto) : cajaMadreUSD.subtract(monto);
                    }
                } else if (mov.getEmpleadoCaja() != null) {
                    Long nroCaja = mov.getEmpleadoCaja().getNroEmpleadoCaja();
                    if (esARS) {
                        BigDecimal balanceActual = balancesEmpleadosARS.getOrDefault(nroCaja, mov.getEmpleadoCaja().getBalanceARS());
                        balancesEmpleadosARS.put(nroCaja, esIngreso ? balanceActual.add(monto) : balanceActual.subtract(monto));
                    } else {
                        BigDecimal balanceActual = balancesEmpleadosUSD.getOrDefault(nroCaja, mov.getEmpleadoCaja().getBalanceUSD());
                        balancesEmpleadosUSD.put(nroCaja, esIngreso ? balanceActual.add(monto) : balanceActual.subtract(monto));
                    }
                } else if (mov.getInmuebleCaja() != null) {
                    Long nroCaja = mov.getInmuebleCaja().getNroInmuebleCaja();
                    if (esARS) {
                        BigDecimal balanceActual = balancesInmueblesARS.getOrDefault(nroCaja, mov.getInmuebleCaja().getBalanceTotalARS());
                        balancesInmueblesARS.put(nroCaja, esIngreso ? balanceActual.add(monto) : balanceActual.subtract(monto));
                    } else {
                        BigDecimal balanceActual = balancesInmueblesUSD.getOrDefault(nroCaja, mov.getInmuebleCaja().getBalanceTotalUSD());
                        balancesInmueblesUSD.put(nroCaja, esIngreso ? balanceActual.add(monto) : balanceActual.subtract(monto));
                    }
                }
            }

            // Actualizar Caja Madre
            cajaMadre.setBalanceTotalARS(cajaMadreARS);
            cajaMadre.setBalanceTotalUSD(cajaMadreUSD);
            cajaMadreRepository.save(cajaMadre);

            // Actualizar Cajas de Empleados
            for (Map.Entry<Long, BigDecimal> entry : balancesEmpleadosARS.entrySet()) {
                EmpleadoCaja caja = empleadoCajaRepository.findById(entry.getKey()).orElseThrow();
                caja.setBalanceARS(entry.getValue());
                empleadoCajaRepository.save(caja);
            }
            for (Map.Entry<Long, BigDecimal> entry : balancesEmpleadosUSD.entrySet()) {
                EmpleadoCaja caja = empleadoCajaRepository.findById(entry.getKey()).orElseThrow();
                caja.setBalanceUSD(entry.getValue());
                empleadoCajaRepository.save(caja);
            }

            // Actualizar Cajas de Inmuebles
            for (Map.Entry<Long, BigDecimal> entry : balancesInmueblesARS.entrySet()) {
                InmuebleCaja caja = inmuebleCajaRepository.findById(entry.getKey()).orElseThrow();
                caja.setBalanceTotalARS(entry.getValue());
                inmuebleCajaRepository.save(caja);
            }
            for (Map.Entry<Long, BigDecimal> entry : balancesInmueblesUSD.entrySet()) {
                InmuebleCaja caja = inmuebleCajaRepository.findById(entry.getKey()).orElseThrow();
                caja.setBalanceTotalUSD(entry.getValue());
                inmuebleCajaRepository.save(caja);
            }

            System.out.println("✅ Balances actualizados correctamente:");
            System.out.println("   Caja Madre - ARS: " + cajaMadreARS + " | USD: " + cajaMadreUSD);
            

        }

        System.out.println("\n========================================");
        System.out.println("✅ Inicialización de datos completada");
        System.out.println("========================================\n");
    }
}