package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.Listados;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DTOClienteListado {
    private Long id;
    private String codCliente;
    private String nombreCliente;
    private String dniCliente;
    private LocalDateTime fechaHoraAltaCliente;
    private List<String> codigosInmuebles;
    private List<String> nombresInmuebles;
    private int cantidadInmuebles;
    private boolean activo;
}