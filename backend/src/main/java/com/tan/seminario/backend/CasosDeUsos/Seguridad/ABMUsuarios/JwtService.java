package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios;

import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private Long jwtExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private Long refreshExpiration;

    public String generateToken(final Usuario user){
        return buildToken(user, jwtExpiration);
    }

    public String generateRefreshToken(final Usuario user){
        return buildToken(user, refreshExpiration);
    }

    private String buildToken(final Usuario user, final long expiration){
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());

        // Extraer los roles del usuario
        List<String> roles = extractUserRoles(user);
        claims.put("roles", roles);

        return Jwts.builder()
                .setId(user.getId().toString())
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, getSignInKey())
                .compact();
    }

    /**
     * Extrae los roles activos del usuario
     */
    private List<String> extractUserRoles(Usuario user) {
        if (user.getEmpleado() != null) {
            Empleado empleado = user.getEmpleado();
            return empleado.getEmpleadosRoles().stream()
                    .filter(er -> er.getFechaHoraBajaEmpleadoRol() == null)
                    .map(EmpleadoRol::getRol)
                    .filter(rol -> rol.getFechaHoraBajaRol() == null)
                    .map(rol -> rol.getCodRol())
                    .distinct()
                    .collect(Collectors.toList());
        }
        // Si es cliente, puede tener roles básicos
        return List.of(); // O definir roles por defecto para clientes
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(final String token){
        final Claims jwtToken = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return jwtToken.getSubject();
    }

    /**
     * Extrae los roles del token JWT
     */
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(final String token) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List) {
            return (List<String>) rolesObj;
        }
        return List.of();
    }

    public boolean isTokenValid(final String refreshToken, final Usuario user) {
        final String username = extractUsername(refreshToken);
        return (username.equals(user.getEmail()) && !isTokenExpired(refreshToken));
    }

    private boolean isTokenExpired(final String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(final String token) {
        final Claims jwtToken = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return jwtToken.getExpiration();
    }
}