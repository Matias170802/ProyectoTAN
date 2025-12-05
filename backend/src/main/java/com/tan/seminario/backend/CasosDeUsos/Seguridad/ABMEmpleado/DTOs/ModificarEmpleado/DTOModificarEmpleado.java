package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.ModificarEmpleado;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DTOModificarEmpleado {

    @Pattern(regexp = "^\\d{7,8}$", message = "El DNI debe tener entre 7 y 8 dígitos")
    private String dniEmpleado;

    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre solo puede contener letras")
    private String nombreEmpleado;

    @Pattern(regexp = "^\\d{10}$", message = "El teléfono debe tener 10 dígitos")
    private String nroTelefonoEmpleado;

    @Positive(message = "El salario debe ser un valor positivo")
    @Min(value = 1, message = "El salario debe ser mayor a 0")
    @Max(value = 99999999, message = "El salario excede el límite permitido")
    private Long salarioEmpleado;
}