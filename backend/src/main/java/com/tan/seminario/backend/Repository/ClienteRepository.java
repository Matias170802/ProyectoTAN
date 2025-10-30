package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}

