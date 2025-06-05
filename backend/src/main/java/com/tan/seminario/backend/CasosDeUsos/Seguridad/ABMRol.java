package com.tan.seminario.backend.CasosDeUsos.Seguridad;

import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.stereotype.Service;

@Service
public class ABMRol  {
    private final RolRepository rolRepository;

        public CrearRolServiceImpl(RolRepository rolRepository) {
            this.rolRepository = rolRepository;
        }

        @Override
        public void ejecutar(CrearRolRequest request) {
            if (rolRepository.existsByNombre(request.getNombre())) {
                throw new IllegalArgumentException("El rol ya existe");
            }
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre(request.getNombre());
            rolRepository.save(nuevoRol);
        }
    }
