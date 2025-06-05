
package com.tan.seminario.backend.CasosDeUsos.Seguridad;

import java.util.List;
import java.util.Optional;

import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.stereotype.Service;

@Service
public class RolService {
    // dependencia del repositorio que accede a la base de datos
    private final RolRepository rolRepository;

    // Constructor
    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    // Guarda un nuevo rol en la base de datos.
    public Rol crearRol(Rol rol) {
        return rolRepository.save(rol);
    }

    // Buscar todos los roles
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // Busca un rol por ID. Usa Optional para manejar el caso en que no exista.
    public Optional<Rol> obtenerRolPorId(Long id) {
        return rolRepository.findById(id);
    }

    // Modificar un rol.
    public Rol actualizarRol(Long id, Rol nuevoRol) {
        return rolRepository.findById(id)
                .map(rol -> {
                    rol.setNombreRol(nuevoRol.getNombreRol());
                    return rolRepository.save(rol);
                }).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    // Baja de un Rol
    public void eliminarRol(Long id) {
        rolRepository.deleteById(id);
    }
}
