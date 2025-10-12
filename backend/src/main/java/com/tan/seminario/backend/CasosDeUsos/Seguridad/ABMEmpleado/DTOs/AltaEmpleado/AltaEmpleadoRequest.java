package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class AltaEmpleadoRequest {
    // Atributos con validaciones
    @NotNull(message = "El DNI no puede ser nulo")
    @NotBlank(message = "El DNI no puede estar vacío")
    @Pattern(regexp = "^\\d{7,8}$", message = "El DNI debe tener entre 7 y 8 dígitos")
    private String dniEmpleado;

    @NotNull(message = "El nombre no puede ser nulo")
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre solo puede contener letras")
    private String nombreEmpleado;

    @NotNull(message = "El teléfono no puede ser nulo")
    @NotBlank(message = "El teléfono no puede estar vacío")
    @Pattern(regexp = "^\\d{10}$", message = "El teléfono debe tener 10 dígitos")
    private String nroTelefonoEmpleado;


    @NotNull(message = "El salario no puede ser nulo")
    @Positive(message = "El salario debe ser un valor positivo")
    @Min(value = 1, message = "El salario debe ser mayor a 0")
    @Max(value = 99999999, message = "El salario excede el límite permitido")
    private Long salarioEmpleado;

    @NotNull(message = "Debe seleccionar al menos un rol")
    @NotEmpty(message = "La lista de roles no puede estar vacía")
    @Size(min = 1, message = "Debe seleccionar al menos un rol")
    private List<String> codRoles;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder los 100 caracteres")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 50, message = "La contraseña debe tener entre 8 y 50 caracteres")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un carácter especial"
    )
    private String password;
}