package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.LoginRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.Cliente;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.Token;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Exceptions.AuthExceptions.ClienteNotFoundException;
import com.tan.seminario.backend.Exceptions.AuthExceptions.EmailAlreadyExistsException;
import com.tan.seminario.backend.Exceptions.AuthExceptions.EmpleadoNotFoundException;
import com.tan.seminario.backend.Exceptions.AuthExceptions.InactiveAccountException;
import com.tan.seminario.backend.Repository.ClienteRepository;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.TokenRepository;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ClienteRepository clienteRepository;

    //REGISTRAR
    @Transactional
    public TokenResponse register(RegisterRequest request) {
        // 1. Validar y normalizar email
        String email = validateAndNormalizeEmail(request.getEmail());

        // 2. Verificar si el email existe
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("El email ya esta registrado");
        }

        // 3. Crear Usuario
        var user = Usuario.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .activo(true)
                .build();

        // 4. Verificar si es un cliente o un empleado
        if (request.getTipoUsuario() == RegisterRequest.TipoUsuario.EMPLEADO) {
            // 4.1 Validar que el empleado exista
            List<Empleado> empleados = empleadoRepository.findByCodEmpleado(request.getCod());
            if (empleados.isEmpty()) {
                throw new EmpleadoNotFoundException("El empleado no existe");
            }
            Empleado empleado = empleados.get(0);

            // 4.2 Agregar empleado a usuario
            user.setEmpleado(empleado);
            user.setName(empleado.getNombreEmpleado());
        } else if (request.getTipoUsuario() == RegisterRequest.TipoUsuario.CLIENTE) {
            // 4.1 Validar que el cliente exista
            Cliente cliente = clienteRepository.findByCodCliente(request.getCod())
                    .orElseThrow(() -> new ClienteNotFoundException("El cliente no existe"));

            // 4.2 Agregar cliente al usuario
            user.setCliente(cliente);
            user.setName(cliente.getNombreCliente());
        }

        // 5. Generar tokens
        var savedUser = usuarioRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUsuarioToken(savedUser, jwtToken); // GUARDA EL TOKEN EN LA BD

        return new TokenResponse(jwtToken, refreshToken);
    }

    // INICIAR SESION
    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 1. Validar y normalizar email
        String email = validateAndNormalizeEmail(request.getEmail());

        // 2. Validar que los campos no estén vacíos
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // 3. Intentar autenticar
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (AuthenticationException e) {
            // Mensaje genérico para no revelar información
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // 4. Buscar usuario por email
        var user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        // 5. Verificar que el usuario esté activo
        if (!user.getActivo()) {
            throw new InactiveAccountException("La cuenta no está activa");
        }

        // 6. Generar tokens
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        // 7. Revocar tokens anteriores y guardar los neuvos tokens
        revokeAllUserTokens(user);
        saveUsuarioToken(user, jwtToken);

        return new TokenResponse(jwtToken, refreshToken);
    }

    // REFRESCAR TOKEN
    @Transactional
    public TokenResponse refreshToken(final String authHeader) {
        // 1. Validar header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Bearer token");
        }

        final String refreshToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(refreshToken);

        // 2. Validar que se extrajo el email
        if (userEmail == null) {
            throw new IllegalArgumentException("Refresh token inválido");
        }

        // 3. Buscar usuario
        final Usuario user = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        // 4. Validar token
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        // 5. Generar nuevo token
        final String jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUsuarioToken(user, jwtToken);

        return new TokenResponse(jwtToken, refreshToken);
    }

    // CERRAR SESION
    @Transactional
    public void logout(String token) {
        Token storedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token no encontrado"));

        storedToken.setExpired(true);
        storedToken.setRevoked(true);
        tokenRepository.save(storedToken);
    }

    // --------------------------------------------------------------

    // METODOS AUXILIARES PRIVADOS
    private void saveUsuarioToken (Usuario user, String jwtToken){
        var token = Token.builder().
                usuario(user).
                token(jwtToken).
                tokenType(Token.TokenType.BEARER).
                expired(false).
                revoked(false).
                build();
        tokenRepository.save(token);
    }

    // REVOCAR TOKEN
    private void revokeAllUserTokens (Usuario user){
        final List<Token> validUserTokens = tokenRepository.findAllValidIsFalseOrRevokedIsFalseByUsuario_Id(user.getId());
        if (!validUserTokens.isEmpty()) {
            for (final Token token : validUserTokens) {
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepository.saveAll(validUserTokens);
        }
    }

    // VALIDACIONES PRIVADAS
    // Regex para validación de email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private String validateAndNormalizeEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        String normalizedEmail = email.toLowerCase().trim();

        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            throw new IllegalArgumentException("Formato de email inválido");
        }

        if (normalizedEmail.length() > 255) {
            throw new IllegalArgumentException("El email es demasiado largo");
        }

        return normalizedEmail;
    }

}