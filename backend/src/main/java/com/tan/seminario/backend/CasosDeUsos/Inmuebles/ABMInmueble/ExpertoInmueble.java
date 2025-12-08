package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble;

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble.DTOAltaInmuebleRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble.DTOAltaInmuebleResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.BajaInmueble.DTOBajaInmuebleResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.Listados.DTOInmuebleListado;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble.DTOModificarInmuebleRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble.DTOModificarInmuebleResponse;
import com.tan.seminario.backend.Entity.Cliente;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Repository.ClienteRepository;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpertoInmueble {

    private final InmuebleRepository inmuebleRepository;
    private final ClienteRepository clienteRepository;

//    public ExpertoInmueble(InmuebleRepository inmuebleRepository) {
//        this.inmuebleRepository = inmuebleRepository;
//    }

    // ============================================================
    // ALTA INMUEBLE
    // ============================================================
    @Transactional
    public DTOAltaInmuebleResponse altaInmueble(DTOAltaInmuebleRequest request) {
        log.info("Iniciando alta de inmueble: {}", request.getNombreInmueble());

        // 1. Validar request
        validarRequest(request);

        // 2. Buscar y validar cliente
        Cliente cliente = clienteRepository.findByCodCliente(request.getCodCliente())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el cliente con código: " + request.getCodCliente()
                ));

        // 3. Validar que el cliente esté activo
        if (cliente.getFechaHoraBajaCliente() != null) {
            throw new IllegalStateException("El cliente está dado de baja");
        }

        // 4. Generar código de inmueble
        String codigoInmueble = generarCodigoInmueble();
        log.info("Código generado: {}", codigoInmueble);

        // 5. Validar que el nombre del inmueble no exista para el cliente
        validarNombreInmuebleUnico(request.getNombreInmueble(), cliente);

        // 6. Crear y guardar inmueble
        Inmueble inmueble = crearInmueble(request, codigoInmueble, cliente);
        inmueble = inmuebleRepository.save(inmueble);
        log.info("Inmueble guardado con ID: {}", inmueble.getId());

        // 7. Construir y retornar respuesta
        DTOAltaInmuebleResponse response = construirResponseAlta(inmueble, cliente);
        log.info("Alta de inmueble completada exitosamente");

        return response;
    }

    // ============================================================
    // BAJA INMUEBLE
    // ============================================================
    @Transactional
    public DTOBajaInmuebleResponse bajaInmueble(Long inmuebleId) {
        log.info("Iniciando baja lógica de inmueble con ID: {}", inmuebleId);

        // 1. Buscar y validar inmueble
        Inmueble inmueble = inmuebleRepository.findByIdAndFechaHoraBajaInmuebleIsNull(inmuebleId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el inmueble con ID: " + inmuebleId
                ));

        // 2. Validar que el inmueble esté activo
        if (inmueble.getFechaHoraBajaInmueble() != null) {
            log.warn("Intento de dar de baja un inmueble ya inactivo: {}", inmuebleId);
            throw new IllegalStateException(
                    "El inmueble ya fue dado de baja el: " + inmueble.getFechaHoraBajaInmueble()
            );
        }

        LocalDateTime fechaBaja = LocalDateTime.now();

        // 3. Dar de baja al inmueble
        inmueble.setFechaHoraBajaInmueble(fechaBaja);
        inmuebleRepository.save(inmueble);
        log.info("Inmueble marcado como inactivo: {}", inmueble.getCodInmueble());

        log.info("Baja de inmueble completada exitosamente: {}", inmueble.getCodInmueble());

        // 4. Construir respuesta
        return DTOBajaInmuebleResponse.builder()
                .mensaje("Inmueble dado de baja correctamente")
                .exito(true)
                .inmueble(DTOBajaInmuebleResponse.DatosInmuebleDadoDeBaja.builder()
                        .id(inmueble.getId())
                        .codInmueble(inmueble.getCodInmueble())
                        .nombreInmueble(inmueble.getNombreInmueble())
                        .direccion(inmueble.getDireccion())
                        .fechaHoraBaja(fechaBaja)
                        .codCliente(inmueble.getCliente().getCodCliente())
                        .nombreCliente(inmueble.getCliente().getNombreCliente())
                        .build())
                .build();
    }

    // ============================================================
    // MODIFICAR INMUEBLE
    // ============================================================
    @Transactional
    public DTOModificarInmuebleResponse modificarInmueble(Long inmuebleId, DTOModificarInmuebleRequest request) {
        log.info("Iniciando modificación de inmueble con ID: {}", inmuebleId);

        // 1. Buscar y validar inmueble
        Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el inmueble con ID: " + inmuebleId
                ));

        // 2. Validar que el inmueble esté activo
        if (inmueble.getFechaHoraBajaInmueble() != null) {
            throw new IllegalStateException("No se puede modificar un inmueble dado de baja");
        }

        boolean modificado = false;

        // 3. Modificar cantidad de baños si se proporciona
        if (request.getCantidadBaños() != null ) {
            inmueble.setCantidadBaños(request.getCantidadBaños());
            modificado = true;
            log.info("Cantidad de baños modificada para inmueble: {}", inmueble.getCodInmueble());
        }

        // 4. Modificar cantidad de dormitorios si se proporciona
        if (request.getCantidadDormitorios() != null) {
            inmueble.setCantidadDormitorios(request.getCantidadDormitorios());
            modificado = true;
            log.info("Cantidad de dormitorios modificada para inmueble: {}", inmueble.getCodInmueble());
        }

        // 5. Modificar capacidad si se proporciona
        if (request.getCapacidad() != null) {
            inmueble.setCapacidad(request.getCapacidad());
            modificado = true;
            log.info("Capacidad modificada para inmueble: {}", inmueble.getCodInmueble());
        }

        // 6. Modificar m2 si se proporciona
        if (request.getM2Inmueble() != null) {
            inmueble.setM2Inmueble(request.getM2Inmueble());
            modificado = true;
            log.info("M2 modificados para inmueble: {}", inmueble.getCodInmueble());
        }

        // 7. Modificar precio por noche si se proporciona
        if (request.getPrecioPorNocheUSD() != null) {
            inmueble.setPrecioPorNocheUSD(request.getPrecioPorNocheUSD());
            modificado = true;
            log.info("Precio por noche modificado para inmueble: {}", inmueble.getCodInmueble());
        }

        if (!modificado) {
            throw new IllegalArgumentException("No se proporcionaron datos para modificar");
        }

        // 8. Guardar cambios
        inmueble = inmuebleRepository.save(inmueble);
        log.info("Inmueble modificado exitosamente: {}", inmueble.getCodInmueble());

        // 9. Construir respuesta
        return DTOModificarInmuebleResponse.builder()
                .mensaje("Inmueble modificado correctamente")
                .exito(true)
                .inmueble(DTOModificarInmuebleResponse.DatosInmuebleModificado.builder()
                        .id(inmueble.getId())
                        .codInmueble(inmueble.getCodInmueble())
                        .nombreInmueble(inmueble.getNombreInmueble())
                        .cantidadBaños(inmueble.getCantidadBaños())
                        .cantidadDormitorios(inmueble.getCantidadDormitorios())
                        .capacidad(inmueble.getCapacidad())
                        .m2Inmueble(inmueble.getM2Inmueble())
                        .precioPorNocheUSD(inmueble.getPrecioPorNocheUSD())
                        .fechaModificacion(LocalDateTime.now())
                        .build())
                .build();
    }

    // ============================================================
    // LISTAR TODOS LOS INMUEBLES
    // ============================================================
    public List<DTOInmuebleListado> listarTodosLosInmuebles() {
        log.info("Listando todos los inmuebles activos");

        // Obtener todos los inmuebles activos
        List<Inmueble> inmuebles = inmuebleRepository.findAll().stream()
                .filter(i -> i.getFechaHoraBajaInmueble() == null)
                .collect(Collectors.toList());

        log.info("Se encontraron {} inmuebles activos", inmuebles.size());

        // Mapear cada inmueble a DTO
        return inmuebles.stream()
                .map(this::convertirInmuebleADTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // LISTAR UN ÚNICO INMUEBLE POR ID
    // ============================================================
    public DTOInmuebleListado listarInmueblePorId(Long inmuebleId) {
        log.info("Buscando inmueble con ID: {}", inmuebleId);

        // Buscar inmueble
        Inmueble inmueble = inmuebleRepository.findByIdAndFechaHoraBajaInmuebleIsNull(inmuebleId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el inmueble con ID: " + inmuebleId
                ));

        // Validar que esté activo
        if (inmueble.getFechaHoraBajaInmueble() != null) {
            throw new IllegalStateException("El inmueble está dado de baja");
        }

        log.info("Inmueble encontrado: {}", inmueble.getCodInmueble());

        return convertirInmuebleADTO(inmueble);
    }

    // ============================================================
    // MÉTODOS PRIVADOS AUXILIARES
    // ============================================================

    private void validarRequest(DTOAltaInmuebleRequest request) {
        if (request.getNombreInmueble() == null || request.getNombreInmueble().isBlank()) {
            throw new IllegalArgumentException("El nombre del inmueble es obligatorio");
        }
        if (request.getDireccion() == null || request.getDireccion().isBlank()) {
            throw new IllegalArgumentException("La dirección es obligatoria");
        }
        if (request.getCodCliente() == null || request.getCodCliente().isBlank()) {
            throw new IllegalArgumentException("El código del cliente es obligatorio");
        }
    }

    private String generarCodigoInmueble() {
        // Obtener el último código
        String ultimoCodigo = inmuebleRepository.findAll().stream()
                .map(Inmueble::getCodInmueble)
                .filter(cod -> cod != null && cod.startsWith("INM"))
                .max(String::compareTo)
                .orElse("INM000");

        try {
            // Extraer el número y incrementar
            String[] partes = ultimoCodigo.split("(?<=INM)");

            if (partes.length != 2) {
                throw new IllegalStateException("Formato de código inválido: " + ultimoCodigo);
            }

            int numero = Integer.parseInt(partes[1]);
            numero++;

            // Formatear con ceros a la izquierda
            return String.format("INM%03d", numero);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("No se pudo parsear el número del código: " + ultimoCodigo, e);
        }
    }

    private void validarNombreInmuebleUnico(String nombreInmueble, Cliente cliente) {
        boolean nombreEnUso = inmuebleRepository.findAll().stream()
                .anyMatch(i -> i.getNombreInmueble().equalsIgnoreCase(nombreInmueble)
                        && i.getCliente().getId().equals(cliente.getId())
                        && i.getFechaHoraBajaInmueble() == null);

        if (nombreEnUso) {
            throw new IllegalArgumentException(
                    "Ya existe un inmueble activo con ese nombre para el cliente: " + cliente.getNombreCliente()
            );
        }
    }

    private Inmueble crearInmueble(DTOAltaInmuebleRequest request, String codigoInmueble, Cliente cliente) {
        Inmueble inmueble = new Inmueble();
        inmueble.setCodInmueble(codigoInmueble);
        inmueble.setNombreInmueble(request.getNombreInmueble());
        inmueble.setCantidadBaños(request.getCantidadBaños());
        inmueble.setCantidadDormitorios(request.getCantidadDormitorios());
        inmueble.setCapacidad(request.getCapacidad());
        inmueble.setDireccion(request.getDireccion());
        inmueble.setM2Inmueble(request.getM2Inmueble());
        inmueble.setPrecioPorNocheUSD(request.getPrecioPorNocheUSD());
        inmueble.setFechaHoraAltaInmueble(LocalDateTime.now());
        inmueble.setFechaHoraBajaInmueble(null);
        inmueble.setCliente(cliente);
        return inmueble;
    }

    private DTOAltaInmuebleResponse construirResponseAlta(Inmueble inmueble, Cliente cliente) {
        return DTOAltaInmuebleResponse.builder()
                .mensaje("Inmueble creado con éxito")
                .exito(true)
                .codInmueble(inmueble.getCodInmueble())
                .nombreInmueble(inmueble.getNombreInmueble())
                .codCliente(cliente.getCodCliente())
                .nombreCliente(cliente.getNombreCliente())
                .build();
    }

    private DTOInmuebleListado convertirInmuebleADTO(Inmueble inmueble) {
        return DTOInmuebleListado.builder()
                .id(inmueble.getId())
                .codInmueble(inmueble.getCodInmueble())
                .nombreInmueble(inmueble.getNombreInmueble())
                .cantidadBaños(inmueble.getCantidadBaños())
                .cantidadDormitorios(inmueble.getCantidadDormitorios())
                .capacidad(inmueble.getCapacidad())
                .direccion(inmueble.getDireccion())
                .m2Inmueble(inmueble.getM2Inmueble())
                .precioPorNocheUSD(inmueble.getPrecioPorNocheUSD())
                .fechaHoraAltaInmueble(inmueble.getFechaHoraAltaInmueble())
                .codCliente(inmueble.getCliente().getCodCliente())
                .nombreCliente(inmueble.getCliente().getNombreCliente())
                .activo(inmueble.getFechaHoraBajaInmueble() == null)
                .build();
    }


    // METODO DEL MATI
    public List<DTOInmueble> obtenerInmuebles() {
        List<Inmueble> inmuebles = inmuebleRepository.findAll();
        List<DTOInmueble> dtos = new ArrayList<>();
        for (Inmueble in : inmuebles) {
            DTOInmueble dto = new DTOInmueble();
            dto.setCodInmueble(in.getCodInmueble());
            dto.setNombreInmueble(in.getNombreInmueble());
            dto.setCapacidad(in.getCapacidad());
            dto.setPrecioPorNocheUSD(in.getPrecioPorNocheUSD());
            dtos.add(dto);
        }
        return dtos;
    }
}
