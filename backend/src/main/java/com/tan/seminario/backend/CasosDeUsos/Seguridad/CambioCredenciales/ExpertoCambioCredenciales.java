package com.tan.seminario.backend.CasosDeUsos.Seguridad.CambioCredenciales;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.CambioCredenciales.DTOs.*;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpertoCambioCredenciales {

    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final TokenRecuperacionRepository tokenRecuperacionRepository;
    private final TokenRepository tokenJwtRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int HORAS_EXPIRACION_TOKEN = 1;
    private static final int MAX_INTENTOS_RECUPERACION_POR_HORA = 3;

    // ============================================================
    // CAMBIO DE CREDENCIALES CON SESIÓN ACTIVA
    // ============================================================

    /**
     * Cambiar email (requiere contraseña actual)
     */
    @Transactional
    public DTOResponseGenerico cambiarEmail(String emailActual, DTOCambiarEmail request) {
        log.info("Solicitud de cambio de email para: {}", emailActual);

        // 1. Buscar usuario actual
        Usuario usuario = usuarioRepository.findByEmail(emailActual)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // 2. Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new IllegalStateException("La cuenta no está activa");
        }

        // 3. Validar contraseña actual
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            log.warn("Intento de cambio de email con contraseña incorrecta: {}", emailActual);
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // 4. Validar que el nuevo email sea diferente
        String nuevoEmail = request.getNuevoEmail().toLowerCase().trim();
        if (emailActual.equalsIgnoreCase(nuevoEmail)) {
            throw new IllegalArgumentException("El nuevo email debe ser diferente al actual");
        }

        // 5. Verificar que el nuevo email no esté en uso
        if (usuarioRepository.existsByEmail(nuevoEmail)) {
            throw new IllegalArgumentException("El email ya está en uso");
        }

        // 6. Actualizar email
        usuario.setEmail(nuevoEmail);
        usuarioRepository.save(usuario);

        // 7. Invalidar todos los tokens JWT del usuario (debe iniciar sesión nuevamente)
        revocarTodosLosTokensJWT(usuario);

        log.info("Email cambiado exitosamente para usuario: {} -> {}", emailActual, nuevoEmail);

        return DTOResponseGenerico.builder()
                .mensaje("Email actualizado correctamente. Por favor, inicie sesión nuevamente con su nuevo email.")
                .exito(true)
                .build();
    }

    /**
     * Cambiar contraseña (requiere contraseña actual + confirmación)
     */
    @Transactional
    public DTOResponseGenerico cambiarPassword(String emailUsuario, DTOCambiarPassword request) {
        log.info("Solicitud de cambio de contraseña para: {}", emailUsuario);

        // 1. Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // 2. Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new IllegalStateException("La cuenta no está activa");
        }

        // 3. Validar contraseña actual
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            log.warn("Intento de cambio de contraseña con contraseña incorrecta: {}", emailUsuario);
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // 4. Validar que la nueva contraseña sea diferente
        if (passwordEncoder.matches(request.getNuevaPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser diferente a la actual");
        }

        // 5. Validar que las contraseñas nuevas coincidan
        if (!request.getNuevaPassword().equals(request.getConfirmarNuevaPassword())) {
            throw new IllegalArgumentException("Las contraseñas nuevas no coinciden");
        }

        // 6. Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);

        // 7. Invalidar todos los tokens JWT (debe iniciar sesión nuevamente)
        revocarTodosLosTokensJWT(usuario);

        log.info("Contraseña cambiada exitosamente para usuario: {}", emailUsuario);

        return DTOResponseGenerico.builder()
                .mensaje("Contraseña actualizada correctamente. Por favor, inicie sesión nuevamente.")
                .exito(true)
                .build();
    }

    // ============================================================
    // RECUPERACIÓN SIN SESIÓN
    // ============================================================

    /**
     * Solicitar recuperación de contraseña (envía email con token)
     * NOTA: En producción, aquí se enviaría un email con el link de recuperación
     */
    @Transactional
    public DTOResponseGenerico solicitarRecuperacionPassword(DTOSolicitarRecuperacionPassword request) {
        String email = request.getEmail().toLowerCase().trim();
        log.info("Solicitud de recuperación de contraseña para: {}", email);

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        // IMPORTANTE: Por seguridad, siempre retornamos el mismo mensaje
        // No revelamos si el email existe o no
        if (usuario == null) {
            log.info("Solicitud de recuperación para email no registrado: {}", email);
            return DTOResponseGenerico.builder()
                    .mensaje("Si el email está registrado, recibirás un enlace de recuperación.")
                    .exito(true)
                    .build();
        }

        // Verificar límite de solicitudes (prevenir spam)
        LocalDateTime hace1Hora = LocalDateTime.now().minusHours(1);
        long intentosRecientes = tokenRecuperacionRepository.contarTokensRecientes(usuario, hace1Hora);

        if (intentosRecientes >= MAX_INTENTOS_RECUPERACION_POR_HORA) {
            log.warn("Demasiados intentos de recuperación para: {}", email);
            // Por seguridad, mismo mensaje
            return DTOResponseGenerico.builder()
                    .mensaje("Si el email está registrado, recibirás un enlace de recuperación.")
                    .exito(true)
                    .build();
        }

        // Invalidar tokens anteriores
        List<TokenRecuperacion> tokensAnteriores = tokenRecuperacionRepository.findByUsuarioAndActivoTrue(usuario);
        tokensAnteriores.forEach(t -> t.setActivo(false));
        tokenRecuperacionRepository.saveAll(tokensAnteriores);

        // Generar nuevo token
        String token = generarTokenSeguro();
        TokenRecuperacion tokenRecuperacion = TokenRecuperacion.builder()
                .token(token)
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .fechaExpiracion(LocalDateTime.now().plusHours(HORAS_EXPIRACION_TOKEN))
                .usado(false)
                .activo(true)
                .build();

        tokenRecuperacionRepository.save(tokenRecuperacion);

        // TODO: Aquí se enviaría el email con el link
        // String linkRecuperacion = "http://tudominio.com/reset-password?token=" + token;
        // emailService.enviarEmailRecuperacion(email, linkRecuperacion);

        log.info("Token de recuperación generado para: {}", email);

        // CAMBIO IMPORTANTE: Usar log.warn() en lugar de log.debug() para que se vea siempre
        log.warn("========================================");
        log.warn("TOKEN DE RECUPERACIÓN (SOLO DESARROLLO)");
        log.warn("Email: {}", email);
        log.warn("Token: {}", token);
        log.warn("Expira: {}", LocalDateTime.now().plusHours(HORAS_EXPIRACION_TOKEN));
        log.warn("========================================");

        return DTOResponseGenerico.builder()
                .mensaje("Si el email está registrado, recibirás un enlace de recuperación.")
                .exito(true)
                .build();
    }

    /**
     * Reestablecer contraseña usando el token recibido por email
     */
    @Transactional
    public DTOResponseGenerico reestablecerPassword(DTOReestablecerPassword request) {
        log.info("Solicitud de reestablecimiento de contraseña con token");

        // 1. Validar que las contraseñas coincidan
        if (!request.getNuevaPassword().equals(request.getConfirmarNuevaPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        // 2. Buscar token
        TokenRecuperacion token = tokenRecuperacionRepository.findByTokenAndActivoTrue(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado"));

        // 3. Validar token
        if (!token.isValido()) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }

        Usuario usuario = token.getUsuario();

        // 4. Validar que la nueva contraseña sea diferente
        if (passwordEncoder.matches(request.getNuevaPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser diferente a la anterior");
        }

        // 5. Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);

        // 6. Marcar token como usado
        token.setUsado(true);
        token.setFechaUso(LocalDateTime.now());
        token.setActivo(false);
        tokenRecuperacionRepository.save(token);

        // 7. Invalidar todos los tokens JWT
        revocarTodosLosTokensJWT(usuario);

        log.info("Contraseña reestablecida exitosamente para: {}", usuario.getEmail());

        return DTOResponseGenerico.builder()
                .mensaje("Contraseña reestablecida correctamente. Ya puedes iniciar sesión.")
                .exito(true)
                .build();
    }

    /**
     * Recuperar email olvidado mediante DNI
     */
    @Transactional(dontRollbackOn = IllegalArgumentException.class)
    public DTORecuperarEmailResponse recuperarEmail(DTORecuperarEmail request) {
        log.info("Solicitud de recuperación de email por DNI");

        String dni = request.getDni();
        String tipoUsuario = request.getTipoUsuario().toUpperCase();

        Usuario usuario = null;

        if ("EMPLEADO".equals(tipoUsuario)) {
            List<Empleado> empleados = empleadoRepository.findByDniEmpleado(dni)
                    .stream()
                    .filter(e -> e.getFechaHoraBajaEmpleado() == null)
                    .toList();

            if (!empleados.isEmpty()) {
                Empleado empleado = empleados.get(0);
                usuario = usuarioRepository.findAll().stream()
                        .filter(u -> u.getEmpleado() != null &&
                                u.getEmpleado().getId().equals(empleado.getId()))
                        .findFirst()
                        .orElse(null);
            }
        } else if ("CLIENTE".equals(tipoUsuario)) {
            Cliente cliente = clienteRepository.findAll().stream()
                    .filter(c -> dni.equals(c.getDniCliente()) && c.getFechaHoraBajaCliente() == null)
                    .findFirst()
                    .orElse(null);

            if (cliente != null) {
                usuario = usuarioRepository.findAll().stream()
                        .filter(u -> u.getCliente() != null &&
                                u.getCliente().getId().equals(cliente.getId()))
                        .findFirst()
                        .orElse(null);
            }
        }

        // Por seguridad, no revelamos si el DNI existe o no
        if (usuario == null) {
            log.info("Solicitud de recuperación de email para DNI no encontrado");
            return DTORecuperarEmailResponse.builder()
                    .mensaje("Si los datos son correctos, encontrarás tu email a continuación.")
                    .emailEncontrado(null)
                    .exito(false)
                    .build();
        }

        // Ocultar parcialmente el email por seguridad (ej: j***@gmail.com)
        String emailOculto = ocultarEmail(usuario.getEmail());

        log.info("Email recuperado para DNI: {}", dni);

        return DTORecuperarEmailResponse.builder()
                .mensaje("Email encontrado")
                .emailEncontrado(emailOculto)
                .exito(true)
                .build();
    }

    // ============================================================
    // MÉTODOS AUXILIARES PRIVADOS
    // ============================================================

    /**
     * Revoca todos los tokens JWT activos de un usuario
     */
    private void revocarTodosLosTokensJWT(Usuario usuario) {
        List<Token> tokensActivos = tokenJwtRepository.findAllValidIsFalseOrRevokedIsFalseByUsuario_Id(usuario.getId());
        tokensActivos.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenJwtRepository.saveAll(tokensActivos);
        log.info("Tokens JWT revocados para usuario: {}", usuario.getEmail());
    }

    /**
     * Genera un token seguro de 64 caracteres
     */
    private String generarTokenSeguro() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[48]; // 48 bytes = 64 caracteres en Base64
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Oculta parcialmente un email para mostrar sin revelar completamente
     * Ejemplo: john.doe@gmail.com -> j***@gmail.com
     */
    private String ocultarEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***@***.***";
        }

        String[] partes = email.split("@");
        String usuario = partes[0];
        String dominio = partes[1];

        String usuarioOculto;
        if (usuario.length() <= 2) {
            usuarioOculto = usuario.charAt(0) + "***";
        } else {
            usuarioOculto = usuario.charAt(0) + "***" + usuario.charAt(usuario.length() - 1);
        }

        return usuarioOculto + "@" + dominio;
    }
}