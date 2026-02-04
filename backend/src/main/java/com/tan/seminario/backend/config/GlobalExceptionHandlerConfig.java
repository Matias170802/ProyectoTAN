package com.tan.seminario.backend.config;

import com.tan.seminario.backend.Exceptions.AuthExceptions.EmailAlreadyExistsException;
import com.tan.seminario.backend.Exceptions.AuthExceptions.EmpleadoNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandlerConfig {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Object> handleEmailExists(EmailAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409 Conflict
                .body(Map.of(
                        "error", "Email ya registrado",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntime(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "Error",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(EmpleadoNotFoundException.class)
    public ResponseEntity<Object> handleEmpleadoNotFound(EmpleadoNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND) // 404 Not Found
                .body(Map.of(
                        "error", "Empleado no encontrado",
                        "message", ex.getMessage()
                ));
    }
}
