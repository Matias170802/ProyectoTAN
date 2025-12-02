package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.CambioCredenciales.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DTORecuperarEmail {
    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{7,8}$", message = "El DNI debe tener entre 7 y 8 dígitos")
    private String dni;

    @NotBlank(message = "El tipo de usuario es obligatorio (EMPLEADO o CLIENTE)")
    @Pattern(regexp = "^(EMPLEADO|CLIENTE)$", message = "El tipo debe ser EMPLEADO o CLIENTE")
    private String tipoUsuario;
}