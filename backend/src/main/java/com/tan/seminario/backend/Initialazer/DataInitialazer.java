package com.tan.seminario.backend.Initialazer;
//clase que se encarga de inicializar los datos que se encuentran en resourses cuando inicia la app y ha cambiado algo

import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

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

    // Constructor correcto para la inyección de dependencia
    public DataInitialazer(EstadoReservaRepository estadoReservaRepository,
                           TipoMovimientoRepository tipoMovimientoRepository,
                           TipoTareaRepository tipoTareaRepository,
                           EstadoTareaRepository estadoTareaRepository,
                           MonedaRepository monedaRepository,
                           CategoriaMovimientoRepository categoriaMovimientoRepository,
                           RolRepository rolRepository,
                           EmpleadoRepository empleadoRepository) {
        this.estadoReservaRepository = estadoReservaRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
        this.tipoTareaRepository = tipoTareaRepository;
        this.estadoTareaRepository = estadoTareaRepository;
        this.monedaRepository = monedaRepository;
        this.categoriaMovimientoRepository = categoriaMovimientoRepository;
        this.rolRepository = rolRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @PostConstruct
    public void initializeData() {

        //inicializacion de datos estado reserva
        if (estadoReservaRepository.count() == 0) {
            // Crear datos iniciales para EstadoReserva
            EstadoReserva estado1 = new EstadoReserva(null, "EST001", "Señada", null, LocalDateTime.now());
            EstadoReserva estado2 = new EstadoReserva(null, "EST002", "Cancelado", null, LocalDateTime.now());
            EstadoReserva estado3 = new EstadoReserva(null, "EST003", "Finalizado", null, LocalDateTime.now());
            EstadoReserva estado4 = new EstadoReserva(null, "EST004", "Preparada", null, LocalDateTime.now());
            EstadoReserva estado5 = new EstadoReserva(null, "EST005", "En Curso", null, LocalDateTime.now());

            // Guardar estados en la base de datos
            estadoReservaRepository.saveAll(Arrays.asList(estado1, estado2, estado3, estado4, estado5));
            System.out.println("Datos iniciales de EstadoReserva insertados correctamente.");

        } else {
            System.out.println("La base de datos ya contiene datos de EstadoReserva, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos estado reserva

        //inicializacion de datos tipo movimiento
        if (tipoMovimientoRepository.count() == 0) {
            TipoMovimiento tipo1 = new TipoMovimiento(null, "TI001", "Ingreso", null, LocalDateTime.now());
            TipoMovimiento tipo2 = new TipoMovimiento(null, "TI002", "Egreso", null, LocalDateTime.now());

            tipoMovimientoRepository.saveAll(Arrays.asList(tipo1, tipo2));
            System.out.println("Datos iniciales de TipoMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de TipoMovimiento, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos tipo movimiento

        //inicializacion de datos Tipo tarea
        if (tipoTareaRepository.count() == 0) {
            TipoTarea tipoTarea1 = new TipoTarea(null, "TT001", "Check-In", LocalDateTime.now(), null);
            TipoTarea tipoTarea2 = new TipoTarea(null, "TT002", "Check-Out", LocalDateTime.now(), null);
            TipoTarea tipoTarea3 = new TipoTarea(null, "TT003", "Pago Sueldos", LocalDateTime.now(), null);
            TipoTarea tipoTarea4 = new TipoTarea(null, "TT004", "Cobro de Inmuebles", LocalDateTime.now(), null);

            tipoTareaRepository.saveAll(Arrays.asList(tipoTarea1, tipoTarea2, tipoTarea3, tipoTarea4));
            System.out.println("Datos iniciales de TipoTarea insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de TipoTarea, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos Tipo tarea

        //inicializacion de datos estado tarea

        if (estadoTareaRepository.count() == 0) {
            EstadoTarea estadoTarea1 = new EstadoTarea(null, "EST001", "Asignada", null, LocalDateTime.now());
            EstadoTarea estadoTarea2 = new EstadoTarea(null, "EST002", "Anulada", null, LocalDateTime.now());
            EstadoTarea estadoTarea3 = new EstadoTarea(null, "EST003", "Finalizada", null, LocalDateTime.now());

            estadoTareaRepository.saveAll(Arrays.asList(estadoTarea1, estadoTarea2, estadoTarea3));
            System.out.println("Datos iniciales de EstadoTarea insertados correctamente.");

        } else {
            System.out.println("La base de datos ya contiene datos de EstadoTarea, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos estado tarea

        //inicializacion de datos moneda
        if (monedaRepository.count() == 0) {
            Moneda moneda1 = new Moneda(null, "MON001", "Peso Argentino", LocalDateTime.now(), null);
            Moneda moneda2 = new Moneda(null, "MON002", "Dolar", LocalDateTime.now(), null);

            monedaRepository.saveAll(Arrays.asList(moneda1, moneda2));
            System.out.println("Datos iniciales de Moneda insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de Moneda, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos moneda

        //inicializacion de datos categoria movimiento
        if (categoriaMovimientoRepository.count() == 0) {

            CategoriaMovimiento categoriaMovimiento1 = new CategoriaMovimiento(null, "CAT001", "Seña", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento2 = new CategoriaMovimiento(null, "CAT002", "Sueldo", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento3 = new CategoriaMovimiento(null, "CAT003", "Cancelacion Reserva", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento4 = new CategoriaMovimiento(null, "CAT004", "Rendicion a Inmueble", LocalDateTime.now(), null);
            CategoriaMovimiento categoriaMovimiento5 = new CategoriaMovimiento(null, "CAT005", "Rendicion de Empleado", LocalDateTime.now(), null);

            categoriaMovimientoRepository.saveAll(Arrays.asList(categoriaMovimiento1, categoriaMovimiento2, categoriaMovimiento3, categoriaMovimiento4, categoriaMovimiento5));
            System.out.println("Datos iniciales de CategoriaMovimiento insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de CategoriaMovimiento, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos categoria movimiento

        //inicializacion de datos roles
        if (rolRepository.count() == 0) {

            Rol rolAdminFinanciero = new Rol(null, "ROL001", "Administrador Financiero", LocalDateTime.now(), null);
            Rol rolGerencia = new Rol(null, "ROL002", "Gerencia", LocalDateTime.now(), null);
            Rol rolEmpleado = new Rol(null, "ROL003", "Empleado", LocalDateTime.now(), null);
            Rol rolAdminReservas = new Rol(null, "ROL004", "Administrador de Reservas", LocalDateTime.now(), null);
            Rol rolAdminSistemas = new Rol(null, "ROL005", "Administrador del Sistema", LocalDateTime.now(), null);

            rolRepository.saveAll(Arrays.asList(rolAdminFinanciero, rolGerencia, rolEmpleado, rolAdminReservas, rolAdminSistemas));
            System.out.println("Datos iniciales de Rol insertados correctamente.");
        } else {
            System.out.println("La base de datos ya contiene datos de Rol, no se inicializaron nuevos datos.");
        }
        //inicializacion de datos roles

        // Creo un empleado de prueba
        Rol rolEmpleado = rolRepository.findByCodRol("ROL003")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Set<Rol> rolesEmpleado = new HashSet<>();
        rolesEmpleado.add(rolEmpleado);

        Empleado empleado = new Empleado(
                null,
                "12345678",
                "EMP-Prueba",
                "Juan Perez",
                "1234567890",
                50000L,
                null,
                LocalDateTime.now(),
                null, // fechaUltimoCobroSalario
                rolesEmpleado
        );
        empleadoRepository.save(empleado);
    }
}
