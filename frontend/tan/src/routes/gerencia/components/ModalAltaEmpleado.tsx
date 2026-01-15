// frontend/tan/src/routes/gerencia/components/ModalAltaEmpleado.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../generalComponents';
import { useAltaEmpleado } from '../hooks/useAltaEmpleado';
import { useFetch } from '../../../generalHooks/useFetch';
import './ModalAltaEntidad.css';

interface Rol {
    codRol: string;
    nombreRol: string;
}

interface ModalAltaEmpleadoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalAltaEmpleado: React.FC<ModalAltaEmpleadoProps> = ({ isOpen, onClose, onSuccess }) => {
    const { altaEmpleado, loading, error, success, resetState } = useAltaEmpleado();
    const { data: roles } = useFetch<Rol[]>('/api/roles');
    
    const [formData, setFormData] = useState({
        dniEmpleado: '',
        nombreEmpleado: '',
        nroTelefonoEmpleado: '',
        salarioEmpleado: '',
        codRoles: [] as string[],
        email: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                dniEmpleado: '',
                nombreEmpleado: '',
                nroTelefonoEmpleado: '',
                salarioEmpleado: '',
                codRoles: [],
                email: '',
                password: ''
            });
            setValidationErrors({});
            resetState();
        }
    }, [isOpen, resetState]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        }
    }, [success, onSuccess, onClose]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.dniEmpleado.trim()) {
            errors.dniEmpleado = 'El DNI es obligatorio';
        } else if (!/^\d{7,8}$/.test(formData.dniEmpleado)) {
            errors.dniEmpleado = 'El DNI debe tener entre 7 y 8 dígitos';
        }

        if (!formData.nombreEmpleado.trim()) {
            errors.nombreEmpleado = 'El nombre es obligatorio';
        } else if (formData.nombreEmpleado.length < 3 || formData.nombreEmpleado.length > 50) {
            errors.nombreEmpleado = 'El nombre debe tener entre 3 y 50 caracteres';
        }

        if (!formData.nroTelefonoEmpleado.trim()) {
            errors.nroTelefonoEmpleado = 'El teléfono es obligatorio';
        } else if (!/^\d{10}$/.test(formData.nroTelefonoEmpleado)) {
            errors.nroTelefonoEmpleado = 'El teléfono debe tener 10 dígitos';
        }

        if (!formData.salarioEmpleado) {
            errors.salarioEmpleado = 'El salario es obligatorio';
        } else if (Number(formData.salarioEmpleado) < 1 || Number(formData.salarioEmpleado) > 99999999) {
            errors.salarioEmpleado = 'El salario debe estar entre 1 y 99999999';
        }

        if (formData.codRoles.length === 0) {
            errors.codRoles = 'Debe seleccionar al menos un rol';
        }

        if (!formData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (!formData.password.trim()) {
            errors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            errors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await altaEmpleado({
                ...formData,
                salarioEmpleado: Number(formData.salarioEmpleado)
            });
        } catch (err) {
            console.error('Error al crear empleado:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRoleToggle = (codRol: string) => {
        setFormData(prev => ({
            ...prev,
            codRoles: prev.codRoles.includes(codRol)
                ? prev.codRoles.filter(r => r !== codRol)
                : [...prev.codRoles, codRol]
        }));
        if (validationErrors.codRoles) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.codRoles;
                return newErrors;
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear Nuevo Empleado"
            description="Complete los datos del nuevo empleado"
            showCloseButton={true}
            wide={true}
        >
            <form onSubmit={handleSubmit} className="modal-alta-form modal-alta-form-wide">
                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert-success">
                        <p><strong>¡Empleado creado exitosamente!</strong></p>
                        <p>Email: {success.email}</p>
                        <p>Contraseña: {success.password}</p>
                        <p className="alert-note">⚠️ Guarda esta contraseña, no se mostrará nuevamente</p>
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dniEmpleado">DNI *</label>
                        <input
                            type="text"
                            id="dniEmpleado"
                            name="dniEmpleado"
                            value={formData.dniEmpleado}
                            onChange={handleInputChange}
                            placeholder="12345678"
                            disabled={loading}
                            className={validationErrors.dniEmpleado ? 'input-error' : ''}
                        />
                        {validationErrors.dniEmpleado && (
                            <span className="error-text">{validationErrors.dniEmpleado}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombreEmpleado">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombreEmpleado"
                            name="nombreEmpleado"
                            value={formData.nombreEmpleado}
                            onChange={handleInputChange}
                            placeholder="Juan Pérez"
                            disabled={loading}
                            className={validationErrors.nombreEmpleado ? 'input-error' : ''}
                        />
                        {validationErrors.nombreEmpleado && (
                            <span className="error-text">{validationErrors.nombreEmpleado}</span>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nroTelefonoEmpleado">Teléfono *</label>
                        <input
                            type="text"
                            id="nroTelefonoEmpleado"
                            name="nroTelefonoEmpleado"
                            value={formData.nroTelefonoEmpleado}
                            onChange={handleInputChange}
                            placeholder="2611234567"
                            disabled={loading}
                            className={validationErrors.nroTelefonoEmpleado ? 'input-error' : ''}
                        />
                        {validationErrors.nroTelefonoEmpleado && (
                            <span className="error-text">{validationErrors.nroTelefonoEmpleado}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="salarioEmpleado">Salario *</label>
                        <input
                            type="number"
                            id="salarioEmpleado"
                            name="salarioEmpleado"
                            value={formData.salarioEmpleado}
                            onChange={handleInputChange}
                            placeholder="50000"
                            disabled={loading}
                            className={validationErrors.salarioEmpleado ? 'input-error' : ''}
                        />
                        {validationErrors.salarioEmpleado && (
                            <span className="error-text">{validationErrors.salarioEmpleado}</span>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="empleado@ejemplo.com"
                            disabled={loading}
                            className={validationErrors.email ? 'input-error' : ''}
                        />
                        {validationErrors.email && (
                            <span className="error-text">{validationErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Mínimo 8 caracteres"
                            disabled={loading}
                            className={validationErrors.password ? 'input-error' : ''}
                        />
                        {validationErrors.password && (
                            <span className="error-text">{validationErrors.password}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Roles * (seleccione al menos uno)</label>
                    <div className="roles-container">
                        {roles?.map(rol => (
                            <label key={rol.codRol} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.codRoles.includes(rol.codRol)}
                                    onChange={() => handleRoleToggle(rol.codRol)}
                                    disabled={loading}
                                />
                                <span>{rol.nombreRol}</span>
                            </label>
                        ))}
                    </div>
                    {validationErrors.codRoles && (
                        <span className="error-text">{validationErrors.codRoles}</span>
                    )}
                </div>

                <div className="form-actions">
                    <Button
                        type="button"
                        label="Cancelar"
                        onClick={onClose}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        label={loading ? 'Creando...' : 'Crear Empleado'}
                        disabled={loading}
                        className="btn-primary"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalAltaEmpleado;