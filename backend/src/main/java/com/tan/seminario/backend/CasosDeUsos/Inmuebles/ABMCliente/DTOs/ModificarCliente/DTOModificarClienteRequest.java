package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class DTOModificarClienteRequest {

    @Pattern(regexp = "^\\d{7,8}$", message = "El DNI debe tener entre 7 y 8 dígitos")
    private String dniCliente;

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre solo puede contener letras")
    private String nombreCliente;
}