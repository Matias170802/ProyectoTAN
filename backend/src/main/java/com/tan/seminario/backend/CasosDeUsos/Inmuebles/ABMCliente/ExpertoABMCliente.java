package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente;

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.BajaCliente.DTOBajaClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.Listados.DTOClienteListado;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente.DTOModificarClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente.DTOModificarClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.AuthService;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpertoABMCliente {

    private final ClienteRepository clienteRepository;
    private final InmuebleRepository inmuebleRepository;
    private final ReservaRepository reservaRepository;
    private final AuthService authService;
    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    private static final String DEFAULT_PASSWORD = "Passw0rd!";

    // ============================================================
    // ALTA CLIENTE
    // ============================================================
    @Transactional
    public DTOAltaClienteResponse altaCliente(DTOAltaClienteRequest request) {
        log.info("Iniciando alta de cliente: {}", request.getNombreCliente());

        // 1. Validar request
        validarRequest(request);

        // 2. Generar código de cliente
        String codigoCliente = generarCodigoCliente();
        log.info("Código generado: {}", codigoCliente);

        // 3. Validar que el DNI no exista en otro cliente
        validarDniUnico(request.getDniCliente());

        // 4. Validar que el email no esté en uso
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está en uso");
        }

        // 5. Crear y guardar cliente
        Cliente cliente = crearCliente(request, codigoCliente);
        cliente = clienteRepository.save(cliente);
        log.info("Cliente guardado con ID: {}", cliente.getId());

        // 6. Crear el usuario para el cliente
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(request.getEmail())
                .password(DEFAULT_PASSWORD)
                .cod(codigoCliente)
                .tipoUsuario(RegisterRequest.TipoUsuario.CLIENTE)
                .build();

        // 7. Obtener los tokens del usuario creado
        TokenResponse tokenResponse = authService.register(registerRequest);
        log.info("Usuario creado y tokens generados para cliente");

        // 8. Construir y retornar respuesta
        DTOAltaClienteResponse response = construirResponseAlta(
                cliente,
                tokenResponse,
                request.getEmail(),
                DEFAULT_PASSWORD
        );
        log.info("Alta de cliente completada exitosamente");

        return response;
    }

    // ============================================================
    // BAJA CLIENTE
    // ============================================================
    @Transactional
    public DTOBajaClienteResponse bajaCliente(Long clienteId) {
        log.info("Iniciando baja lógica de cliente con ID: {}", clienteId);

        // 1. Buscar y validar cliente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el cliente con ID: " + clienteId
                ));

        // 2. Validar que el cliente esté activo
        if (cliente.getFechaHoraBajaCliente() != null) {
            log.warn("Intento de dar de baja un cliente ya inactivo: {}", clienteId);
            throw new IllegalStateException(
                    "El cliente ya fue dado de baja el: " + cliente.getFechaHoraBajaCliente()
            );
        }

        // 3. Obtener todos los inmuebles activos del cliente
        List<Inmueble> inmueblesActivos = inmuebleRepository.findAll().stream()
                .filter(inmueble -> inmueble.getCliente().getId().equals(clienteId))
                .filter(inmueble -> inmueble.getFechaHoraBajaInmueble() == null)
                .collect(Collectors.toList());

        // 4. Validar que ningún inmueble tenga reservas activas o futuras
        for (Inmueble inmueble : inmueblesActivos) {
            validarReservasActivasOFuturas(inmueble);
        }

        LocalDateTime fechaBaja = LocalDateTime.now();

        // 5. Dar de baja al cliente
        cliente.setFechaHoraBajaCliente(fechaBaja);
        clienteRepository.save(cliente);
        log.info("Cliente marcado como inactivo: {}", cliente.getCodCliente());

        // 6. Dar de baja todos los inmuebles del cliente
        int inmueblesAfectados = 0;
        if (!inmueblesActivos.isEmpty()) {
            inmueblesActivos.forEach(inmueble -> inmueble.setFechaHoraBajaInmueble(fechaBaja));
            inmuebleRepository.saveAll(inmueblesActivos);
            inmueblesAfectados = inmueblesActivos.size();
            log.info("Dados de baja {} inmuebles del cliente", inmueblesAfectados);
        }

        // 7. Desactivar el usuario asociado
        List<Usuario> usuarios = usuarioRepository.findAll().stream()
                .filter(u -> u.getCliente() != null)
                .filter(u -> u.getCliente().getId().equals(clienteId))
                .collect(Collectors.toList());

        if (!usuarios.isEmpty()) {
            usuarios.forEach(usuario -> {
                usuario.setActivo(false);

                // Revocar todos los tokens activos del usuario
                revocarTodosLosTokensJWT(usuario);

                log.info("Usuario desactivado y tokens revocados para cliente: {}",
                        cliente.getCodCliente());
            });
            usuarioRepository.saveAll(usuarios);
        }

        log.info("Baja de cliente completada exitosamente: {}", cliente.getCodCliente());

        // 8. Construir respuesta
        return DTOBajaClienteResponse.builder()
                .mensaje("Cliente dado de baja correctamente")
                .exito(true)
                .cliente(DTOBajaClienteResponse.DatosClienteDadoDeBaja.builder()
                        .id(cliente.getId())
                        .codCliente(cliente.getCodCliente())
                        .nombreCliente(cliente.getNombreCliente())
                        .dniCliente(cliente.getDniCliente())
                        .fechaHoraBaja(fechaBaja)
                        .inmueblesAfectados(inmueblesAfectados)
                        .build())
                .build();
    }

    // ============================================================
    // MODIFICAR CLIENTE
    // ============================================================
    @Transactional
    public DTOModificarClienteResponse modificarCliente(Long clienteId, DTOModificarClienteRequest request) {
        log.info("Iniciando modificación de cliente con ID: {}", clienteId);

        // 1. Buscar y validar cliente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el cliente con ID: " + clienteId
                ));

        // 2. Validar que el cliente esté activo
        if (cliente.getFechaHoraBajaCliente() != null) {
            throw new IllegalStateException("No se puede modificar un cliente dado de baja");
        }

        boolean modificado = false;

        // 3. Modificar DNI si se proporciona
        if (request.getDniCliente() != null && !request.getDniCliente().isBlank()) {
            // Validar que el DNI no esté en uso por otro cliente
            clienteRepository.findAll().stream()
                    .filter(c -> !c.getId().equals(clienteId))
                    .filter(c -> c.getFechaHoraBajaCliente() == null)
                    .filter(c -> c.getDniCliente().equals(request.getDniCliente()))
                    .findFirst()
                    .ifPresent(c -> {
                        throw new IllegalArgumentException("El DNI ya está en uso por otro cliente");
                    });

            cliente.setDniCliente(request.getDniCliente());
            modificado = true;
            log.info("DNI modificado para cliente: {}", cliente.getCodCliente());
        }

        // 4. Modificar nombre si se proporciona
        if (request.getNombreCliente() != null && !request.getNombreCliente().isBlank()) {
            cliente.setNombreCliente(request.getNombreCliente());

            // Actualizar el nombre en el usuario asociado
            usuarioRepository.findAll().stream()
                    .filter(u -> u.getCliente() != null)
                    .filter(u -> u.getCliente().getId().equals(clienteId))
                    .findFirst()
                    .ifPresent(usuario -> {
                        usuario.setName(request.getNombreCliente());
                        usuarioRepository.save(usuario);
                    });

            modificado = true;
            log.info("Nombre modificado para cliente: {}", cliente.getCodCliente());
        }

        if (!modificado) {
            throw new IllegalArgumentException("No se proporcionaron datos para modificar");
        }

        // 5. Guardar cambios
        cliente = clienteRepository.save(cliente);
        log.info("Cliente modificado exitosamente: {}", cliente.getCodCliente());

        // 6. Construir respuesta
        return DTOModificarClienteResponse.builder()
                .mensaje("Cliente modificado correctamente")
                .exito(true)
                .codCliente(cliente.getCodCliente())
                .nombreCliente(cliente.getNombreCliente())
                .dniCliente(cliente.getDniCliente())
                .build();
    }

    // ============================================================
    // LISTAR TODOS LOS CLIENTES
    // ============================================================
    public List<DTOClienteListado> listarTodosLosClientes() {
        log.info("Listando todos los clientes activos");

        // Obtener todos los clientes activos
        List<Cliente> clientes = clienteRepository.findAll().stream()
                .filter(c -> c.getFechaHoraBajaCliente() == null)
                .collect(Collectors.toList());

        log.info("Se encontraron {} clientes activos", clientes.size());

        // Mapear cada cliente a DTO
        return clientes.stream()
                .map(this::convertirClienteADTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // LISTAR UN ÚNICO CLIENTE POR ID
    // ============================================================
    public DTOClienteListado listarClientePorId(Long clienteId) {
        log.info("Buscando cliente con ID: {}", clienteId);

        // Buscar cliente
        Cliente cliente = clienteRepository.findByIdAndFechaHoraBajaClienteIsNull(clienteId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el cliente con ID: " + clienteId
                ));

        log.info("Cliente encontrado: {}", cliente.getCodCliente());

        return convertirClienteADTO(cliente);
    }

    // ============================================================
    // MÉTODOS PRIVADOS AUXILIARES
    // ============================================================

    private void validarRequest(DTOAltaClienteRequest request) {
        if (request.getDniCliente() == null || request.getDniCliente().isBlank()) {
            throw new IllegalArgumentException("El DNI es obligatorio");
        }
        if (request.getNombreCliente() == null || request.getNombreCliente().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
    }

    private String generarCodigoCliente() {
        // Obtener el último código
        String ultimoCodigo = clienteRepository.findAll().stream()
                .map(Cliente::getCodCliente)
                .filter(cod -> cod != null && cod.startsWith("CLI"))
                .max(String::compareTo)
                .orElse("CLI000");

        try {
            // Extraer el número y incrementar
            String[] partes = ultimoCodigo.split("(?<=CLI)");

            if (partes.length != 2) {
                throw new IllegalStateException("Formato de código inválido: " + ultimoCodigo);
            }

            int numero = Integer.parseInt(partes[1]);
            numero++;

            // Formatear con ceros a la izquierda
            return String.format("CLI%03d", numero);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("No se pudo parsear el número del código: " + ultimoCodigo, e);
        }
    }

    private void validarDniUnico(String dni) {
        boolean dniEnUso = clienteRepository.findAll().stream()
                .anyMatch(c -> c.getDniCliente().equals(dni) && c.getFechaHoraBajaCliente() == null);

        if (dniEnUso) {
            throw new IllegalArgumentException("Ya existe un cliente activo con ese DNI");
        }
    }

    /**
     * Valida que el inmueble no tenga reservas activas o futuras (excepto canceladas)
     */
    private void validarReservasActivasOFuturas(Inmueble inmueble) {
        LocalDateTime ahora = LocalDateTime.now();

        // Obtener todas las reservas del inmueble
        List<Reserva> reservasDelInmueble = reservaRepository.findByInmueble(inmueble);

        // Filtrar reservas que estén en curso o sean futuras
        List<Reserva> reservasProblematicas = reservasDelInmueble.stream()
                .filter(reserva -> {
                    EstadoReserva estado = reserva.getEstadoReserva();
                    String nombreEstado = estado != null ? estado.getNombreEstadoReserva() : "";

                    // Ignorar reservas canceladas o finalizadas
                    if ("Cancelada".equalsIgnoreCase(nombreEstado) ||
                            "Finalizada".equalsIgnoreCase(nombreEstado)) {
                        return false;
                    }

                    // Verificar si la reserva está en curso o es futura
                    LocalDateTime fechaFin = reserva.getFechaHoraFinReserva();
                    return fechaFin != null && fechaFin.isAfter(ahora);
                })
                .collect(Collectors.toList());

        if (!reservasProblematicas.isEmpty()) {
            log.warn("Intento de dar de baja cliente con inmueble {} que tiene {} reservas activas/futuras",
                    inmueble.getCodInmueble(), reservasProblematicas.size());

            // Construir mensaje con detalles de las reservas
            StringBuilder mensaje = new StringBuilder(
                    "No se puede dar de baja el cliente porque el inmueble ")
                    .append(inmueble.getNombreInmueble())
                    .append(" (")
                    .append(inmueble.getCodInmueble())
                    .append(") tiene reservas activas o futuras. Reservas: ");

            for (int i = 0; i < reservasProblematicas.size(); i++) {
                Reserva r = reservasProblematicas.get(i);
                mensaje.append(r.getCodReserva())
                        .append(" (")
                        .append(r.getEstadoReserva().getNombreEstadoReserva())
                        .append(", hasta ")
                        .append(r.getFechaHoraFinReserva())
                        .append(")");

                if (i < reservasProblematicas.size() - 1) {
                    mensaje.append(", ");
                }
            }

            throw new IllegalStateException(mensaje.toString());
        }

        log.debug("Validación exitosa: el inmueble {} no tiene reservas activas o futuras",
                inmueble.getCodInmueble());
    }

    private Cliente crearCliente(DTOAltaClienteRequest request, String codigoCliente) {
        Cliente cliente = new Cliente();
        cliente.setDniCliente(request.getDniCliente());
        cliente.setCodCliente(codigoCliente);
        cliente.setNombreCliente(request.getNombreCliente());
        cliente.setFechaHoraAltaCliente(LocalDateTime.now());
        cliente.setFechaHoraBajaCliente(null);
        return cliente;
    }

    private DTOAltaClienteResponse construirResponseAlta(
            Cliente cliente,
            TokenResponse tokenResponse,
            String email,
            String password
    ) {
        return DTOAltaClienteResponse.builder()
                .tokenResponse(tokenResponse)
                .nombreCliente(cliente.getNombreCliente())
                .codCliente(cliente.getCodCliente())
                .mensaje("Cliente creado con éxito!")
                .email(email)
                .password(password)
                .build();
    }

    private void revocarTodosLosTokensJWT(Usuario usuario) {
        List<Token> tokensActivos = tokenRepository
                .findAllValidIsFalseOrRevokedIsFalseByUsuario_Id(usuario.getId());

        if (!tokensActivos.isEmpty()) {
            tokensActivos.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(tokensActivos);
            log.info("Revocados {} tokens del usuario: {}", tokensActivos.size(), usuario.getEmail());
        }
    }

    private DTOClienteListado convertirClienteADTO(Cliente cliente) {
        // Obtener inmuebles activos del cliente
        List<Inmueble> inmueblesActivos = inmuebleRepository.findAll().stream()
                .filter(i -> i.getCliente().getId().equals(cliente.getId()))
                .filter(i -> i.getFechaHoraBajaInmueble() == null)
                .collect(Collectors.toList());

        List<String> codigosInmuebles = inmueblesActivos.stream()
                .map(Inmueble::getCodInmueble)
                .collect(Collectors.toList());

        List<String> nombresInmuebles = inmueblesActivos.stream()
                .map(Inmueble::getNombreInmueble)
                .collect(Collectors.toList());

        return DTOClienteListado.builder()
                .id(cliente.getId())
                .codCliente(cliente.getCodCliente())
                .nombreCliente(cliente.getNombreCliente())
                .dniCliente(cliente.getDniCliente())
                .fechaHoraAltaCliente(cliente.getFechaHoraAltaCliente())
                .codigosInmuebles(codigosInmuebles)
                .nombresInmuebles(nombresInmuebles)
                .cantidadInmuebles(inmueblesActivos.size())
                .activo(cliente.getFechaHoraBajaCliente() == null)
                .build();
    }
}