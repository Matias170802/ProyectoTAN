package com.tan.seminario.backend.ServicesImpl;


import com.tan.seminario.backend.Entity.Base;
import com.tan.seminario.backend.Repository.BaseRepository;
import com.tan.seminario.backend.Services.BaseService;
import jakarta.transaction.Transactional;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public abstract class BaseServiceImpl<E extends Base, ID extends Serializable> implements BaseService<E, ID> {

    protected BaseRepository <E ,ID> baseRepository;

    public  BaseServiceImpl(BaseRepository<E,ID> baseRepository) {
        this.baseRepository = baseRepository;
    }


    @Override
    @Transactional
// indicamos que es una transaccion asique cada vez que se ejecute hace un commit un push un todo y un rollback si ocurre un error
    public List<E> findAll() throws Exception {
        try {
            // find all entities in the repository
            List<E> entities = baseRepository.findAll();
            return entities;
        }catch (Exception e){
            // throw an exception if an error occurs
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public E findById(ID id) throws Exception {
        try {
            // find an entity by its id
            Optional<E> entityOpcional = baseRepository.findById(id);
            return entityOpcional.get();
        }catch (Exception e){
            // throw an exception if an error occurs
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public E save(E entity) throws Exception {
        try {
            // save an entity to the repository
            entity = baseRepository.save(entity);
            return entity;
        }catch (Exception e){
            // throw an exception if an error occurs
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public E update(ID id, E entity) throws Exception {
        try {
            // find an entity by its id
            Optional<E> entityOpcional = baseRepository.findById(id);
            // update the entity
            E entityUdtate = entityOpcional.get();
            entityUdtate = baseRepository.save(entity);
            return entityUdtate;
        }catch (Exception e){
            // throw an exception if an error occurs
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean delete(ID id) throws Exception {
        try {
            // check if the entity exists
            if (baseRepository.existsById(id)){
                // delete the entity
                baseRepository.deleteById(id);
                return true;
            }else {
                // throw an exception if the entity does not exist
                throw new Exception();
            }
        }catch (Exception e){
            // throw an exception if an error occurs
            throw new Exception(e.getMessage());
        }
    }
}