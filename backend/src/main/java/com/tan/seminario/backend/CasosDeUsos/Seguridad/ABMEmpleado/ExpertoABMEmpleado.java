package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.AuthService;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoCaja;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.EmpleadoCajaRepository;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpertoABMEmpleado {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final RolRepository rolRepository;
    private final AuthService authService;

    @Transactional
    public AltaEmpleadoResponse altaEmpleado(AltaEmpleadoRequest request) {
        log.info("Iniciando alta de empleado: {}", request.getNombreEmpleado());

        // 1. Validar que tenga roles
        validarRequest(request);

        // 2. Generar código de empleado
        String codigoEmpleado = generarCodigoEmpleado();
        log.info("Código generado: {}", codigoEmpleado);

        // 3. Validar que el DNI no exista en otro empleado
        validarDniUnico(request.getDniEmpleado());

        // 4. Validar y obtener roles
        List<Rol> rolesValidados = validarYObtenerRoles(request.getCodRoles());

        // 5. Crear y guardar empleado
        Empleado empleado = crearEmpleado(request, codigoEmpleado);
        asociarRolesAEmpleado(empleado, rolesValidados);
        empleado = empleadoRepository.save(empleado);
        log.info("Empleado guardado con ID: {}", empleado.getId());

        // 6. Crear el usuario para el empleado
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .cod(codigoEmpleado)
                .tipoUsuario(RegisterRequest.TipoUsuario.EMPLEADO)
                .build();

        // 7. Obtener los tokens del usuario creado
        TokenResponse tokenResponse = authService.register(registerRequest);
        log.info("Usuario creado y tokens generados");

        String email = registerRequest.getEmail();
        String password = registerRequest.getPassword();

        //  8. Crear caja del empleado
        EmpleadoCaja empleadoCaja = crearCajaEmpleado(empleado);
        log.info("Caja creada exitosamente para el empleado con número: {}", empleadoCaja.getNroEmpleadoCaja());

        // 9. Construir y retornar respuesta
        AltaEmpleadoResponse response = construirResponse(
                empleado,
                tokenResponse,
                request.getEmail(),
                request.getPassword()
        );
        log.info("Alta de empleado completada exitosamente");

        return response;
    }

    // BAJA EMPLEADO (TODO)

    // MODIFICAR EMPLEADO (TODO)

    // LISTAR EMPLEADOS (TODO)

    // ============================================================
    // MÉTODOS PRIVADOS AUXILIARES
    //

    // Valida que el request tenga los datos mínimos necesarios
    private void validarRequest(AltaEmpleadoRequest request) {
        if (request.getCodRoles() == null || request.getCodRoles().isEmpty()) {
            throw new IllegalArgumentException("Debe asignar al menos un rol");
        }
    }

    //Genera el próximo código de empleado en formato EMPL-XXX
    private String generarCodigoEmpleado() {
        // Obtener el último código
        String ultimoCodigo = empleadoRepository.findTopByOrderByCodEmpleadoDesc()
                .map(Empleado::getCodEmpleado)
                .orElse("EMPL-000");

        try {
            // Extraer el número y incrementar
            String[] partes = ultimoCodigo.split("-");

            if (partes.length != 2) {
                throw new IllegalStateException("Formato de código inválido: " + ultimoCodigo);
            }

            int numero = Integer.parseInt(partes[1]);
            numero++;

            // Formatear con ceros a la izquierda
            return String.format("EMPL-%03d", numero);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("No se pudo parsear el número del código: " + ultimoCodigo, e);
        } catch (ArrayIndexOutOfBoundsException e) {
            throw new IllegalStateException("Código de empleado con formato incorrecto: " + ultimoCodigo, e);
        }
    }

    private void validarDniUnico(String dni) {
        if (empleadoRepository.existsByDniEmpleadoAndFechaHoraBajaEmpleadoIsNull(dni)) {
            throw new IllegalArgumentException("Ya existe un empleado activo con ese DNI");
        }
    }

    private List<Rol> validarYObtenerRoles(List<String> codRoles) {
        List<Rol> roles = rolRepository
                .findAllByCodRolInAndFechaHoraBajaRolIsNull(codRoles);

        if (roles.size() != codRoles.size()) {
            throw new IllegalArgumentException("Algunos roles son inválidos o están inactivos");
        }

        return roles;
    }

    private Empleado crearEmpleado(AltaEmpleadoRequest request, String codigoEmpleado) {
        return Empleado.builder()
                .dniEmpleado(request.getDniEmpleado())
                .codEmpleado(codigoEmpleado)
                .nombreEmpleado(request.getNombreEmpleado())
                .nroTelefonoEmpleado(request.getNroTelefonoEmpleado())
                .salarioEmpleado(request.getSalarioEmpleado())
                .fechaHoraAltaEmpleado(LocalDateTime.now())
                .fechaHoraBajaEmpleado(null)
                .fechaUltimoCobroSalario(null)
                .empleadosRoles(new ArrayList<>())
                .build();
    }

    private void asociarRolesAEmpleado(Empleado empleado, List<Rol> roles) {
        LocalDateTime ahora = LocalDateTime.now();

        for (Rol rol : roles) {
            EmpleadoRol empleadoRol = EmpleadoRol.builder()
                    .fechaHoraAltaEmpleadoRol(ahora)
                    .fechaHoraBajaEmpleadoRol(null)
                    .empleado(empleado)
                    .rol(rol)
                    .build();

            empleado.getEmpleadosRoles().add(empleadoRol);
        }
    }

    private AltaEmpleadoResponse construirResponse(Empleado empleado, TokenResponse tokenResponse, String email, String password) {
        return AltaEmpleadoResponse.builder()
                .tokenResponse(tokenResponse)
                .nombreEmpleado(empleado.getNombreEmpleado())
                .mensaje("Empleado creado con exito!")
                .email(email)
                .password(password)
                .build();
    }

    /**
     * Crea la caja del empleado con número secuencial y valores iniciales
     */
    private EmpleadoCaja crearCajaEmpleado(Empleado empleado) {
        Long numeroSecuencial = generarNumeroSecuencialCaja();

        EmpleadoCaja empleadoCaja = new EmpleadoCaja();
        empleadoCaja.setNroEmpleadoCaja(numeroSecuencial);
        empleadoCaja.setNombreEmpleadoCaja(empleado.getNombreEmpleado());
        empleadoCaja.setBalanceARS(BigDecimal.ZERO);
        empleadoCaja.setBalanceUSD(BigDecimal.ZERO);
        empleadoCaja.setFechaHoraAltaEmpleadoCaja(LocalDateTime.now());
        empleadoCaja.setFechaHoraBajaEmpleadoCaja(null);
        empleadoCaja.setEmpleado(empleado);

        return empleadoCajaRepository.save(empleadoCaja);
    }

    /**
     * Genera el próximo número secuencial para la caja del empleado
     */
    private Long generarNumeroSecuencialCaja() {
        Long ultimoNumero = empleadoCajaRepository.findAll().stream()
                .map(EmpleadoCaja::getNroEmpleadoCaja)
                .max(Long::compareTo)
                .orElse(0L);

        return ultimoNumero + 1;
    }

}