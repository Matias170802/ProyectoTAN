package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends BaseRepository<Cliente, Long>{

    // Buscar Clientes Activos
    List<Cliente> findByFechaHoraBajaClienteIsNull();

    // Buscar Cliente por el CodCliente
    Optional<Cliente> findByCodCliente(String codCliente);

    // Buscar por el DNI
    Optional<Cliente> findByDniCliente(String dniCliente);
}
