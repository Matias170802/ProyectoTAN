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

    //Maneja errores especificos
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<DTOErrorResponse> handleRuntimeException(RuntimeException ex) {
        DTOErrorResponse error = new DTOErrorResponse();
        error.setMensaje(ex.getMessage());
        error.setCodigo(HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Maneja errores inesperados
    @ExceptionHandler(Exception.class)
    public ResponseEntity<DTOErrorResponse> handleException(Exception ex) {
        DTOErrorResponse error = new DTOErrorResponse("Error inesperado", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
