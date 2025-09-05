package com.tan.seminario.backend.CasosDeUsos.Seguridad;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.TokenResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
//    private final AuthenticationManager authenticationManager;

    //REGISTRAR
    public TokenResponse register(RegisterRequest request) {
        // TODO: Usar el IDEmpleado / IDCliente del RegisterRequest
        Empleado empleado = empleadoRepository.findByCodEmpleado("EMP-Prueba")
                .orElseThrow(() -> new EmpleadoNotFoundException("El empleado no existe"));
        // TODO: Validar que el email no exista en la BD
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

    // register, login, refreshToken
}
