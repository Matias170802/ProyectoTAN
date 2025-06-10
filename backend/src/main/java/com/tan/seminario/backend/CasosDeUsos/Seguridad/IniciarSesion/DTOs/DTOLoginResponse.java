package com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs;

import com.tan.seminario.backend.Entity.Rol;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DTOLoginResponse {
    String token;
    String error;
    String nombre;
    List<Rol> roles;
}
