package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.BajaEmpleado.BajaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.Listados.DTOEmpleadoListado;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.AuthService;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpertoABMEmpleado {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoCajaRepository empleadoCajaRepository;
    private final RolRepository rolRepository;
    private final AuthService authService;
    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRolRepository empleadoRolRepository;

    // ============================================================
    // ALTA EMPLEADO
    // ============================================================
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

    // ============================================================
    // BAJA EMPLEADO
    // ============================================================
    @Transactional
    public BajaEmpleadoResponse bajaEmpleado(Long empleadoId) {
        log.info("Iniciando baja lógica de empleado con ID: {}", empleadoId);

        // 1. Buscar y validar empleado
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el empleado con ID: " + empleadoId
                ));

        // 2. Validar que el empleado esté activo
        if (empleado.getFechaHoraBajaEmpleado() != null) {
            log.warn("Intento de dar de baja un empleado ya inactivo: {}", empleadoId);
            throw new IllegalStateException(
                    "El empleado ya fue dado de baja el: " + empleado.getFechaHoraBajaEmpleado()
            );
        }

        LocalDateTime fechaBaja = LocalDateTime.now();

        // 3. Dar de baja al empleado
        empleado.setFechaHoraBajaEmpleado(fechaBaja);
        empleadoRepository.save(empleado);
        log.info("Empleado marcado como inactivo: {}", empleado.getCodEmpleado());

        // 4. Dar de baja todos los roles activos del empleado
        List<EmpleadoRol> rolesActivos = empleadoRolRepository.findAll().stream()
                .filter(er -> er.getEmpleado().getId().equals(empleadoId))
                .filter(er -> er.getFechaHoraBajaEmpleadoRol() == null)
                .collect(Collectors.toList());

        if (!rolesActivos.isEmpty()) {
            rolesActivos.forEach(rol -> rol.setFechaHoraBajaEmpleadoRol(fechaBaja));
            empleadoRolRepository.saveAll(rolesActivos);
            log.info("Dados de baja {} roles del empleado", rolesActivos.size());
        }

        // 5. Dar de baja la caja del empleado
        List<EmpleadoCaja> cajasActivas = empleadoCajaRepository.findAll().stream()
                .filter(caja -> caja.getEmpleado().getId().equals(empleadoId))
                .filter(caja -> caja.getFechaHoraBajaEmpleadoCaja() == null)
                .collect(Collectors.toList());

        if (!cajasActivas.isEmpty()) {
            cajasActivas.forEach(caja -> caja.setFechaHoraBajaEmpleadoCaja(fechaBaja));
            empleadoCajaRepository.saveAll(cajasActivas);
            log.info("Dadas de baja {} cajas del empleado", cajasActivas.size());
        }

        // 6. Desactivar el usuario asociado
        List<Usuario> usuarios = usuarioRepository.findAll().stream()
                .filter(u -> u.getEmpleado() != null)
                .filter(u -> u.getEmpleado().getId().equals(empleadoId))
                .collect(Collectors.toList());

        if (!usuarios.isEmpty()) {
            usuarios.forEach(usuario -> {
                usuario.setActivo(false);

                // Revocar todos los tokens activos del usuario
                revocarTodosLosTokensJWT(usuario);

                log.info("Usuario desactivado y tokens revocados para empleado: {}",
                        empleado.getCodEmpleado());
            });
            usuarioRepository.saveAll(usuarios);
        }

        log.info("Baja de empleado completada exitosamente: {}", empleado.getCodEmpleado());

        // 7. Construir respuesta
        return BajaEmpleadoResponse.builder()
                .mensaje("Empleado dado de baja correctamente")
                .exito(true)
                .empleado(BajaEmpleadoResponse.DatosEmpleadoDadoDeBaja.builder()
                        .id(empleado.getId())
                        .codEmpleado(empleado.getCodEmpleado())
                        .nombreEmpleado(empleado.getNombreEmpleado())
                        .dniEmpleado(empleado.getDniEmpleado())
                        .fechaHoraBaja(fechaBaja)
                        .build())
                .build();
    }

    // ============================================================
    // MODIFICAR EMPLEADO (TODO)
    // ============================================================

    // ============================================================
    // LISTAR TODOS LOS EMPLEADOS
    // ============================================================
    public List<DTOEmpleadoListado> listarTodosLosEmpleados() {
        log.info("Listando todos los empleados");

        // Obtener todos los empleados activos
        List<Empleado> empleados = empleadoRepository.findByFechaHoraBajaEmpleadoIsNull();

        log.info("Se encontraron {} empleados activos", empleados.size());

        // Mapear cada empleado a DTO
        return empleados.stream()
                .map(this::convertirEmpleadoADTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // LISTAR UN UNICO EMPLEADO POR ID
    // ============================================================
    public DTOEmpleadoListado listarEmpleadoPorId(Long empleadoId) {
        log.info("Buscando empleado con ID: {}", empleadoId);

        // Buscar empleado
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el empleado con ID: " + empleadoId
                ));

        log.info("Empleado encontrado: {}", empleado.getCodEmpleado());

        return convertirEmpleadoADTO(empleado);
    }

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

    private void revocarTodosLosTokensJWT(Usuario usuario) {
        List<Token> tokensActivos = tokenRepository.findAllValidIsFalseOrRevokedIsFalseByUsuario_Id(usuario.getId());

        if (!tokensActivos.isEmpty()) {
            tokensActivos.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(tokensActivos);
            log.info("Revocados {} tokens del usuario: {}", tokensActivos.size(), usuario.getEmail());
        }
    }

    //Convierte un empleado a DTO con toda la información necesaria
    private DTOEmpleadoListado convertirEmpleadoADTO(Empleado empleado) {
        // Obtener roles activos del empleado
        List<EmpleadoRol> rolesActivos = empleado.getEmpleadosRoles().stream()
                .filter(er -> er.getFechaHoraBajaEmpleadoRol() == null)
                .filter(er -> er.getRol().getFechaHoraBajaRol() == null)
                .collect(Collectors.toList());

        List<String> codigosRoles = rolesActivos.stream()
                .map(er -> er.getRol().getCodRol())
                .distinct()
                .collect(Collectors.toList());

        List<String> nombresRoles = rolesActivos.stream()
                .map(er -> er.getRol().getNombreRol())
                .distinct()
                .collect(Collectors.toList());

        // Obtener la caja del empleado
        EmpleadoCaja caja = empleadoCajaRepository.findAll().stream()
                .filter(c -> c.getEmpleado().getId().equals(empleado.getId()))
                .filter(c -> c.getFechaHoraBajaEmpleadoCaja() == null)
                .findFirst()
                .orElse(null);

        BigDecimal balanceARS = BigDecimal.ZERO;
        BigDecimal balanceUSD = BigDecimal.ZERO;

        if (caja != null) {
            balanceARS = caja.getBalanceARS() != null ? caja.getBalanceARS() : BigDecimal.ZERO;
            balanceUSD = caja.getBalanceUSD() != null ? caja.getBalanceUSD() : BigDecimal.ZERO;
        }

        // Construir y retornar DTO
        return DTOEmpleadoListado.builder()
                .id(empleado.getId())
                .codEmpleado(empleado.getCodEmpleado())
                .nombreEmpleado(empleado.getNombreEmpleado())
                .dniEmpleado(empleado.getDniEmpleado())
                .codigosRoles(codigosRoles)
                .nombresRoles(nombresRoles)
                .balanceCajaARS(balanceARS)
                .balanceCajaUSD(balanceUSD)
                .activo(empleado.getFechaHoraBajaEmpleado() == null)
                .build();
    }
}