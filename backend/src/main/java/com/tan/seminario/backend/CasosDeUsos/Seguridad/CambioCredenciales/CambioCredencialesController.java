package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.CambioCredenciales;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.CambioCredenciales.DTOs.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/credenciales")
@RequiredArgsConstructor
public class CambioCredencialesController {

    private final ExpertoCambioCredenciales expertoCambioCredenciales;

    // ============================================================
    // ENDPOINTS CON AUTENTICACIÓN (SESIÓN ACTIVA)
    // ============================================================

    /**
     * Cambiar email (requiere estar autenticado)
     * POST /api/credenciales/cambiar-email
     */
    @PostMapping("/cambiar-email")
    public ResponseEntity<DTOResponseGenerico> cambiarEmail(
            Authentication authentication,
            @Valid @RequestBody DTOCambiarEmail request
    ) {
        String emailActual = authentication.getName();
        DTOResponseGenerico response = expertoCambioCredenciales.cambiarEmail(emailActual, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Cambiar contraseña (requiere estar autenticado)
     * POST /api/credenciales/cambiar-password
     */
    @PostMapping("/cambiar-password")
    public ResponseEntity<DTOResponseGenerico> cambiarPassword(
            Authentication authentication,
            @Valid @RequestBody DTOCambiarPassword request
    ) {
        String emailUsuario = authentication.getName();
        DTOResponseGenerico response = expertoCambioCredenciales.cambiarPassword(emailUsuario, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // ENDPOINTS SIN AUTENTICACIÓN (RECUPERACIÓN)
    // ============================================================

    /**
     * Solicitar recuperación de contraseña (sin autenticación)
     * POST /api/credenciales/recuperar-password/solicitar
     *
     * En producción, esto enviaría un email con un link de recuperación
     */
    @PostMapping("/recuperar-password/solicitar")
    public ResponseEntity<DTOResponseGenerico> solicitarRecuperacionPassword(
            @Valid @RequestBody DTOSolicitarRecuperacionPassword request
    ) {
        DTOResponseGenerico response = expertoCambioCredenciales.solicitarRecuperacionPassword(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Reestabl contraseña usando token (sin autenticación)
     * POST /api/credenciales/recuperar-password/reestablecer
     */
    @PostMapping("/recuperar-password/reestablecer")
    public ResponseEntity<DTOResponseGenerico> reestablecerPassword(
            @Valid @RequestBody DTOReestablecerPassword request
    ) {
        DTOResponseGenerico response = expertoCambioCredenciales.reestablecerPassword(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Recuperar email olvidado mediante DNI (sin autenticación)
     * POST /api/credenciales/recuperar-email
     */
    @PostMapping("/recuperar-email")
    public ResponseEntity<DTORecuperarEmailResponse> recuperarEmail(
            @Valid @RequestBody DTORecuperarEmail request
    ) {
        DTORecuperarEmailResponse response = expertoCambioCredenciales.recuperarEmail(request);
        return ResponseEntity.ok(response);
    }
}