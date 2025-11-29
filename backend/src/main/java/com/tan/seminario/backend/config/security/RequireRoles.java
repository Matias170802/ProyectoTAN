package com.tan.seminario.backend.config.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anotación para requerir roles específicos en un endpoint
 *
 * Uso:
 * @RequireRoles({"ROL001", "ROL002"})
 * public ResponseEntity<?> miEndpoint() { ... }
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRoles {
    /**
     * Lista de códigos de rol permitidos
     */
    String[] value();

    /**
     * Si es true, el usuario debe tener TODOS los roles especificados
     * Si es false, basta con tener AL MENOS UNO de los roles
     */
    boolean requireAll() default false;
}