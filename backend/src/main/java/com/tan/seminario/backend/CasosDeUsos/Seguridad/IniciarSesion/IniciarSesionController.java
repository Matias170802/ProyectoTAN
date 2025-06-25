package com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs.DTOLoginRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs.DTOLoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class IniciarSesionController {

    @Autowired
    private final ExpertoIniciarSesion experto;

    public IniciarSesionController(ExpertoIniciarSesion experto) {
        this.experto = experto;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<DTOLoginResponse> login(@RequestBody DTOLoginRequest request){
        try {
            return ResponseEntity.ok(experto.login(request));
        } catch (Exception e) {
            DTOLoginResponse dto = new DTOLoginResponse();
            dto.setError(e.getMessage());
            return ResponseEntity.badRequest().body(dto);
        }
    }

}
