package com.tan.seminario.backend.CasosDeUsos.Inmuebles;

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.DTOInmueble;
import com.tan.seminario.backend.Entity.Inmueble;
import com.tan.seminario.backend.Repository.InmuebleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {
    @Autowired
    private ExpertoInmueble experto;

    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmueble>> obtenerInmuebles() {
        try {
            List<DTOInmueble> inmuebles = experto.obtenerInmuebles();
            return ResponseEntity.ok(inmuebles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
}
