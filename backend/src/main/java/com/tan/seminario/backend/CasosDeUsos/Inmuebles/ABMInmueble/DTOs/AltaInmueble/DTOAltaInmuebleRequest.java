package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class DTOAltaInmuebleRequest {

    @NotNull(message = "La cantidad de baños no puede ser nula")
    @Min(value = 1, message = "Debe tener al menos 1 baño")
    @Max(value = 20, message = "La cantidad de baños no puede exceder 20")
    private Integer cantidadBaños;

    @NotNull(message = "La cantidad de dormitorios no puede ser nula")
    @Min(value = 1, message = "Debe tener al menos 1 dormitorio")
    @Max(value = 20, message = "La cantidad de dormitorios no puede exceder 20")
    private Integer cantidadDormitorios;

    @NotNull(message = "La capacidad no puede ser nula")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Max(value = 50, message = "La capacidad no puede exceder 50 personas")
    private Integer capacidad;

    @NotNull(message = "La dirección no puede ser nula")
    @NotBlank(message = "La dirección no puede estar vacía")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccion;

    @NotNull(message = "Los m2 no pueden ser nulos")
    @Min(value = 10, message = "Los m2 deben ser al menos 10")
    @Max(value = 10000, message = "Los m2 no pueden exceder 10000")
    private Double m2Inmueble;

    @NotNull(message = "El nombre del inmueble no puede ser nulo")
    @NotBlank(message = "El nombre del inmueble no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreInmueble;

    @NotNull(message = "El precio por noche no puede ser nulo")
    @Min(value = 1, message = "El precio debe ser al menos 1 USD")
    @Max(value = 100000, message = "El precio no puede exceder 100000 USD")
    private Double precioPorNocheUSD;

    @NotNull(message = "El código del cliente no puede ser nulo")
    @NotBlank(message = "El código del cliente no puede estar vacío")
    @Pattern(regexp = "^CLI\\d{3}$", message = "El código del cliente debe tener el formato CLI###")
    private String codCliente;
}