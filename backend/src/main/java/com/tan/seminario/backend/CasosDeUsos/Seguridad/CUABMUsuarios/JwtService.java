package com.tan.seminario.backend.CasosDeUsos.Seguridad.CUABMUsuarios;

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
import java.util.Map;

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

        return Jwts.builder()
                .setId(user.getId().toString())
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, getSignInKey())
                .compact();
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

    public boolean isTokenValid(final String refreshToken, final Usuario user) {
        final String username = extractUsername(refreshToken);
        return (username.equals(user.getEmail()) && !isTokenExpired(refreshToken));
    }

    private boolean isTokenExpired(final String token) {
        // Comparo las fechas para verificar si la sesion es valida
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