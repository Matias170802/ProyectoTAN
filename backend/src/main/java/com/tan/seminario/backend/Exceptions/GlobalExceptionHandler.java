package com.tan.seminario.backend.Exceptions;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.ExpertoRegistrarCotizacionMoneda;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.tan.seminario.backend.DTOGenerales.DTOErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Maneja errores específicos (RuntimeException)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<DTOErrorResponse> handleRuntimeException(RuntimeException ex) {
        DTOErrorResponse error = new DTOErrorResponse();
        error.setMensaje(ex.getMessage());
        error.setCodigo(HttpStatus.BAD_REQUEST.value());
        log.error("RuntimeException: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Maneja errores inesperados (Exception)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<DTOErrorResponse> handleException(Exception ex) {
        DTOErrorResponse error = new DTOErrorResponse();
        error.setMensaje(ex.getMessage() != null ? ex.getMessage() : "Error inesperado");
        error.setCodigo(HttpStatus.INTERNAL_SERVER_ERROR.value());
        log.error("Exception: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
