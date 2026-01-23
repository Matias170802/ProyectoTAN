// frontend/tan/src/routes/gerencia/components/ModalAltaCliente.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../generalComponents';
import { useAltaCliente } from '../hooks/useAltaCliente';
import './ModalAltaEntidad.css';

interface ModalAltaClienteProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalAltaCliente: React.FC<ModalAltaClienteProps> = ({ isOpen, onClose, onSuccess }) => {
    const { altaCliente, loading, error, success, resetState } = useAltaCliente();
    
    const [formData, setFormData] = useState({
        dniCliente: '',
        nombreCliente: '',
        email: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                dniCliente: '',
                nombreCliente: '',
                email: ''
            });
            setValidationErrors({});
            resetState();
        }
    }, [isOpen, resetState]);

    useEffect(() => {
        if (success) {
            // Keep modal open so user can copy credentials and click Aceptar
            // onSuccess/onClose will be triggered by the Aceptar button below
        }
    }, [success, onSuccess, onClose]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.dniCliente.trim()) {
            errors.dniCliente = 'El DNI es obligatorio';
        } else if (!/^\d{7,8}$/.test(formData.dniCliente)) {
            errors.dniCliente = 'El DNI debe tener entre 7 y 8 dígitos';
        }

        if (!formData.nombreCliente.trim()) {
            errors.nombreCliente = 'El nombre es obligatorio';
        } else if (formData.nombreCliente.length < 3 || formData.nombreCliente.length > 100) {
            errors.nombreCliente = 'El nombre debe tener entre 3 y 100 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombreCliente)) {
            errors.nombreCliente = 'El nombre solo puede contener letras';
        }

        if (!formData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await altaCliente(formData);
        } catch (err) {
            console.error('Error al crear cliente:', err);
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear Nuevo Cliente"
            description="Complete los datos del nuevo cliente"
            showCloseButton={true}
        >
            <form onSubmit={handleSubmit} className="modal-alta-form">
                {success && (
                    <div style={{ textAlign: 'center' }}>
                        <div className="alert-success" style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '18px', marginBottom: '16px' }}><strong>✓ ¡Cliente creado exitosamente!</strong></p>
                            <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Email:</strong><br/>
                                    <code style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '3px', display: 'inline-block', marginTop: '4px' }}>
                                        {success.email}
                                    </code>
                                </p>
                                <p style={{ margin: '12px 0 0 0' }}>
                                    <strong>Contraseña:</strong><br/>
                                    <code style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '3px', display: 'inline-block', marginTop: '4px' }}>
                                        {success.password}
                                    </code>
                                </p>
                            </div>
                            <p style={{ fontSize: '14px', color: '#d32f2f', marginBottom: '0' }}>⚠️ Guarda estas credenciales. No se mostrarán nuevamente.</p>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <Button
                                label="Aceptar"
                                onClick={() => {
                                    onSuccess();
                                    onClose();
                                }}
                                className="btn-primary"
                            />
                        </div>
                    </div>
                )}
                {!success && (
                    <>
                        {error && (
                            <div className="alert-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="dniCliente">DNI *</label>
                            <input
                                type="text"
                                id="dniCliente"
                                name="dniCliente"
                                value={formData.dniCliente}
                                onChange={handleInputChange}
                                placeholder="12345678"
                                disabled={loading}
                                className={validationErrors.dniCliente ? 'input-error' : ''}
                            />
                            {validationErrors.dniCliente && (
                                <span className="error-text">{validationErrors.dniCliente}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombreCliente">Nombre Completo *</label>
                            <input
                                type="text"
                                id="nombreCliente"
                                name="nombreCliente"
                                value={formData.nombreCliente}
                                onChange={handleInputChange}
                                placeholder="Juan Pérez"
                                disabled={loading}
                                className={validationErrors.nombreCliente ? 'input-error' : ''}
                            />
                            {validationErrors.nombreCliente && (
                                <span className="error-text">{validationErrors.nombreCliente}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="cliente@ejemplo.com"
                                disabled={loading}
                                className={validationErrors.email ? 'input-error' : ''}
                            />
                            {validationErrors.email && (
                                <span className="error-text">{validationErrors.email}</span>
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
                                label={loading ? 'Creando...' : 'Crear Cliente'}
                                disabled={loading}
                                className="btn-primary"
                            />
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
};

export default ModalAltaCliente;