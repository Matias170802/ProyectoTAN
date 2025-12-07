package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.LoginRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    // ENDPOINT DESTINADO AL TESTING UNICAMENTE
//    @PostMapping("/register")
//    public ResponseEntity<TokenResponse> register(@RequestBody final RegisterRequest request) {
//        final TokenResponse token = service.register(request);
//        return ResponseEntity.ok(token);
//    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticate(@RequestBody final LoginRequest request) {
        final TokenResponse token = service.login(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    public TokenResponse refreshToken(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader){
        return service.refreshToken(authHeader);
    }
}