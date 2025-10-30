package com.tan.seminario.backend.Exceptions.AuthExceptions;

public class EmpleadoNotFoundException extends RuntimeException {
    public EmpleadoNotFoundException(String message) {
        super(message);
    }
}