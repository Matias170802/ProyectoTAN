package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMCliente;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMCliente.DTOs.DTOAltaClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.ExpertoABMUsuario;
import com.tan.seminario.backend.Entity.Cliente;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.ClienteRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertoABMCliente {

    @Autowired
    private final ClienteRepository clienteRepository;

    @Autowired
    private final RolRepository rolRepository;

    @Autowired
    private final ExpertoABMUsuario expertoABMUsuario;


    public ExpertoABMCliente(ClienteRepository clienteRepository,
                             RolRepository rolRepository,
                             ExpertoABMUsuario expertoABMUsuario) {
        this.clienteRepository = clienteRepository;
        this.rolRepository = rolRepository;
        this.expertoABMUsuario = expertoABMUsuario;
    }

    // ALTA CLIENTE
    // REVISAR QUE DEVUELVE
    public void altaCliente(DTOAltaClienteRequest dtoAltaClienteRequest) throws Exception{
        // DTO (nombreCliente, dniCliente, codCliente)
        // 1. Buscar que no exista el cliente con el mismo codigo
        Optional<Cliente> clienteWithSameCod = clienteRepository.findByCodCliente(dtoAltaClienteRequest.getCodCliente());
        if (clienteWithSameCod.isPresent()) {
            throw new Exception("El codigo de cliente ya existe");
        }
        // 2. Buscar que no exista el cliente con el mismo dni
        Optional<Cliente> clienteWithSameDNI = clienteRepository.findByDniCliente(dtoAltaClienteRequest.getDniCliente());
        if (clienteWithSameDNI.isPresent()) {
            throw new Exception("El DNI del cliente ya existe");
        }

        // 3. Buscar el rol de nombre Cliente dado de alta en la base de datos
        Optional<Rol> rolCliente = rolRepository.findByNombreRolIgnoreCaseAndActivo("Cliente");
        if (rolCliente.isEmpty()) {
            throw new Exception("No se pueden registrar clientes. Falta el Rol de Cliente");
        }



        // 4. DAR DE ALTA EL CLIENTE
        Cliente cliente = new Cliente(dtoAltaClienteRequest.getCodCliente(),
                dtoAltaClienteRequest.getDniCliente(),
                dtoAltaClienteRequest.getNombreCliente(),
                null,
                LocalDateTime.now(),
                rolCliente.get()
                );

        // IR al CU Alta Usuario


        clienteRepository.save(cliente);
    }


    // BAJA CLIENTE

    // MODIFICAR CLIENTE

    // LISTAR CLIENTES ACTIVOS
    public List<Cliente> listarClientesActivos() {
        return clienteRepository.findByFechaHoraBajaClienteIsNull();
    }
}
