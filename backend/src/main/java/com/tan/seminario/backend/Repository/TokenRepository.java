package com.tan.seminario.backend.Repository;

import com.tan.seminario.backend.Entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
