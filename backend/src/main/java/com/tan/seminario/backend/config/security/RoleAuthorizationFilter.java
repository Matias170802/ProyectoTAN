package com.tan.seminario.backend.config.security;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor
public class RoleAuthorizationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final RequestMappingHandlerMapping handlerMapping;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Permitir peticiones a /auth sin validación de roles
        if (request.getServletPath().contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Obtener el handler del endpoint
            HandlerExecutionChain handlerChain = handlerMapping.getHandler(request);
            if (handlerChain == null || !(handlerChain.getHandler() instanceof HandlerMethod)) {
                filterChain.doFilter(request, response);
                return;
            }

            HandlerMethod handlerMethod = (HandlerMethod) handlerChain.getHandler();

            // Verificar si el método o la clase tienen la anotación @RequireRoles
            RequireRoles methodAnnotation = handlerMethod.getMethodAnnotation(RequireRoles.class);
            RequireRoles classAnnotation = handlerMethod.getBeanType().getAnnotation(RequireRoles.class);

            // Si no hay anotación de roles, permitir acceso (solo requiere autenticación)
            if (methodAnnotation == null && classAnnotation == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Usar la anotación del método si existe, sino la de la clase
            RequireRoles annotation = methodAnnotation != null ? methodAnnotation : classAnnotation;

            // Verificar que el usuario esté autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("Intento de acceso sin autenticación a endpoint con roles requeridos");
                sendUnauthorizedError(response, "Autenticación requerida");
                return;
            }

            // Extraer el token JWT del header
            final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Token no proporcionado para endpoint con roles requeridos");
                sendUnauthorizedError(response, "Token requerido");
                return;
            }

            final String jwtToken = authHeader.substring(7);

            // Extraer roles del token
            List<String> userRoles = jwtService.extractRoles(jwtToken);
            List<String> requiredRoles = Arrays.asList(annotation.value());

            log.debug("Validando permisos - Usuario: {} | Roles del usuario: {} | Roles requeridos: {}",
                    authentication.getName(), userRoles, requiredRoles);

            // Validar permisos
            boolean hasPermission;
            if (annotation.requireAll()) {
                // Requiere TODOS los roles
                hasPermission = userRoles.containsAll(requiredRoles);
                if (!hasPermission) {
                    log.warn("Usuario {} no tiene TODOS los roles requeridos. Tiene: {}, Necesita: {}",
                            authentication.getName(), userRoles, requiredRoles);
                }
            } else {
                // Requiere AL MENOS UNO de los roles
                hasPermission = requiredRoles.stream().anyMatch(userRoles::contains);
                if (!hasPermission) {
                    log.warn("Usuario {} no tiene NINGUNO de los roles requeridos. Tiene: {}, Necesita al menos uno de: {}",
                            authentication.getName(), userRoles, requiredRoles);
                }
            }

            if (!hasPermission) {
                sendForbiddenError(response, "No tiene los permisos necesarios para acceder a este recurso", requiredRoles);
                return;
            }

            log.debug("Acceso autorizado para usuario: {}", authentication.getName());
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("Error en filtro de autorización por roles", e);
            sendUnauthorizedError(response, "Error al validar permisos");
        }
    }

    private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"statusCode\": 401}",
                message
        ));
    }

    private void sendForbiddenError(HttpServletResponse response, String message, List<String> requiredRoles) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Forbidden\", \"message\": \"%s\", \"requiredRoles\": %s, \"statusCode\": 403}",
                message,
                requiredRoles.toString()
        ));
    }
}