package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DTORegistrarUsuarioResponse {
    private String username;
    private String password;
}
