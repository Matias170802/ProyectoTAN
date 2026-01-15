package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class DTOModificarInmuebleRequest {

    @Min(value = 1, message = "Debe tener al menos 1 baño")
    @Max(value = 20, message = "La cantidad de baños no puede exceder 20")
    private Integer cantidadBaños;

    @Min(value = 1, message = "Debe tener al menos 1 dormitorio")
    @Max(value = 20, message = "La cantidad de dormitorios no puede exceder 20")
    private Integer cantidadDormitorios;

    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Max(value = 50, message = "La capacidad no puede exceder 50 personas")
    private Integer capacidad;

    @Min(value = 10, message = "Los m2 deben ser al menos 10")
    @Max(value = 10000, message = "Los m2 no pueden exceder 10000")
    private Double m2Inmueble;

    @Min(value = 1, message = "El precio debe ser al menos 1 USD")
    @Max(value = 100000, message = "El precio no puede exceder 100000 USD")
    private Double precioPorNocheUSD;
}