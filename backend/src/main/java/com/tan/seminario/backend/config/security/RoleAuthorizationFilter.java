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

            // Si no hay anotación, permitir acceso
            if (methodAnnotation == null && classAnnotation == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Usar la anotación del método si existe, sino la de la clase
            RequireRoles annotation = methodAnnotation != null ? methodAnnotation : classAnnotation;

            // Extraer el token JWT del header
            final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                sendUnauthorizedError(response, "Token no proporcionado");
                return;
            }

            final String jwtToken = authHeader.substring(7);

            // Extraer roles del token
            List<String> userRoles = jwtService.extractRoles(jwtToken);
            List<String> requiredRoles = Arrays.asList(annotation.value());

            log.debug("Usuario tiene roles: {}", userRoles);
            log.debug("Endpoint requiere roles: {}", requiredRoles);

            // Validar permisos
            boolean hasPermission;
            if (annotation.requireAll()) {
                // Requiere TODOS los roles
                hasPermission = userRoles.containsAll(requiredRoles);
            } else {
                // Requiere AL MENOS UNO de los roles
                hasPermission = requiredRoles.stream().anyMatch(userRoles::contains);
            }

            if (!hasPermission) {
                log.warn("Usuario sin permisos suficientes. Roles del usuario: {}, Roles requeridos: {}",
                        userRoles, requiredRoles);
                sendForbiddenError(response, "No tiene permisos para acceder a este recurso");
                return;
            }

            // Usuario tiene los permisos necesarios
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("Error en filtro de autorización por roles", e);
            sendUnauthorizedError(response, "Error al validar permisos");
        }
    }

    private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Unauthorized\", \"message\": \"%s\"}", message
        ));
    }

    private void sendForbiddenError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Forbidden\", \"message\": \"%s\"}", message
        ));
    }
}