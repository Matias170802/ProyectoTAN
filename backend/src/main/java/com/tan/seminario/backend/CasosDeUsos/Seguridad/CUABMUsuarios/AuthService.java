package com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios.DTOs.LoginRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.Token;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Exceptions.AuthExceptions.EmailAlreadyExistsException;
import com.tan.seminario.backend.Exceptions.AuthExceptions.EmpleadoNotFoundException;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.TokenRepository;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    //REGISTRAR
    public TokenResponse register(RegisterRequest request) {
        // TODO: Usar el IDEmpleado / IDCliente del RegisterRequest
//        Empleado empleado = empleadoRepository.findByCodEmpleado("EMP-Prueba")
//                .orElseThrow(() -> new EmpleadoNotFoundException("El empleado no existe"));
        List<Empleado> empleados = empleadoRepository.findByCodEmpleado("EMP-Prueba");
        Empleado empleado = empleados.get(0);
        if (empleado == null) {
            throw new EmpleadoNotFoundException("El empleado no existe");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("El email ya esta registrado");
        }
        var user = Usuario.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .empleado(empleado)//DEBE ESTAR ENCRIPTADA PARA GUARDAR EN BD
                .build();
        //  Si es empleado seteo el idEmpleado, sino seteo idCliente

        var savedUser = usuarioRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUsuarioToken(savedUser, jwtToken); // GUARDA EL TOKEN EN LA BD
        return new TokenResponse(jwtToken, refreshToken);
    }

    // INICIAR SESION
    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword())
        );
        var user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUsuarioToken(user, jwtToken); // GUARDA EL TOKEN EN LA BD
        return new TokenResponse(jwtToken, refreshToken);
    }

    // REFRESCAR TOKEN
    public TokenResponse refreshToken(final String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Bearer token");
        }
        final String refreshToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(refreshToken);

        // Validar el Token que nos han enviado
        if (userEmail == null) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        final Usuario user = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException(userEmail));
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        final String jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user); // REVOCA LOS TOKENS ANTERIORES
        saveUsuarioToken(user, jwtToken); // GUARDA EL TOKEN EN LA BD
        return new TokenResponse(jwtToken, refreshToken);
    }


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
        final List<Token> validUserTokens = tokenRepository.findAllValidIsFalseOrRevokedIsFalseByUsuario_IdUsuario(user.getId());
        if (!validUserTokens.isEmpty()) {
            for (final Token token : validUserTokens) {
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepository.saveAll(validUserTokens);
        }
    }
}