package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Override
    Optional<Cliente> findById(Long aLong);

    Optional<Cliente> findByCodCliente(String cod);
}
