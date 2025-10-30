package com.tan.seminario.backend.Exceptions.AuthExceptions;

public class ClienteNotFoundException extends RuntimeException {

    public ClienteNotFoundException(String mensaje) {
        super(mensaje);
    }
}