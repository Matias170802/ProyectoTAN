package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.CambioCredenciales.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DTOCambiarEmail {
    @NotBlank(message = "El nuevo email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder los 100 caracteres")
    private String nuevoEmail;

    @NotBlank(message = "La contraseña actual es obligatoria")
    private String passwordActual;
}