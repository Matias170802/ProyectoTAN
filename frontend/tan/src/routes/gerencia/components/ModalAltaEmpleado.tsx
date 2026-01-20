// frontend/tan/src/routes/gerencia/components/ModalAltaEmpleado.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Modal, Button } from '../../../generalComponents';
import { useAltaEmpleado } from '../hooks/useAltaEmpleado';
import { useFetch } from '../../../generalHooks/useFetch';
import './ModalAltaEntidad.css';

interface Rol {
    id: number;
    codigo: string;
    nombre: string;
}

interface ModalAltaEmpleadoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalAltaEmpleado: React.FC<ModalAltaEmpleadoProps> = ({ isOpen, onClose, onSuccess }) => {
    const { altaEmpleado, loading, error, success, resetState } = useAltaEmpleado();
    const [showPassword, setShowPassword] = useState(false);
    
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const authOptions = useMemo(() => token ? { headers: { 'Authorization': `Bearer ${token}` } } : undefined, [token]);
    const { data: rolesData } = useFetch<Rol[]>('/api/roles', authOptions);
    
    // Filtrar roles: excluir "Cliente" (ROL006) y obtener solo los disponibles
    const rolesDisponibles = useMemo(() => {
        if (!rolesData) return [];
        return rolesData.filter(rol => rol.codigo !== 'ROL006');
    }, [rolesData]);

    // Obtener el código del rol "Empleado"
    const rolEmpleadoCodigo = useMemo(() => {
        const rolEmpleado = rolesDisponibles.find(r => r.nombre === 'Empleado');
        return rolEmpleado?.codigo || 'ROL003';
    }, [rolesDisponibles]);
    
    const [formData, setFormData] = useState({
        dniEmpleado: '',
        nombreEmpleado: '',
        nroTelefonoEmpleado: '',
        salarioEmpleado: '',
        codRoles: [rolEmpleadoCodigo],
        email: '',
        password: 'Passw0rd!'
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Actualizar el rol empleado cuando se carga la lista de roles
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            codRoles: prev.codRoles.includes(rolEmpleadoCodigo) 
                ? prev.codRoles 
                : [rolEmpleadoCodigo, ...prev.codRoles.filter(r => r !== rolEmpleadoCodigo)]
        }));
    }, [rolEmpleadoCodigo]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                dniEmpleado: '',
                nombreEmpleado: '',
                nroTelefonoEmpleado: '',
                salarioEmpleado: '',
                codRoles: [rolEmpleadoCodigo],
                email: '',
                password: 'Passw0rd!'
            });
            setValidationErrors({});
            resetState();
        }
    }, [isOpen, resetState, rolEmpleadoCodigo]);

    useEffect(() => {
        if (success) {
            // No hacer nada, dejar que el usuario haga clic en "Aceptar"
        }
    }, [success]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.dniEmpleado.trim()) {
            errors.dniEmpleado = 'El DNI es obligatorio';
        } else if (!/^\d{7,8}$/.test(formData.dniEmpleado)) {
            errors.dniEmpleado = 'El DNI debe tener entre 7 y 8 dígitos';
        }

        if (!formData.nombreEmpleado.trim()) {
            errors.nombreEmpleado = 'El nombre es obligatorio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombreEmpleado)) {
            errors.nombreEmpleado = 'El nombre solo puede contener letras';
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
        } else if (formData.password.length < 8 || formData.password.length > 50) {
            errors.password = 'La contraseña debe tener entre 8 y 50 caracteres';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await altaEmpleado({
                dniEmpleado: formData.dniEmpleado,
                nombreEmpleado: formData.nombreEmpleado,
                nroTelefonoEmpleado: formData.nroTelefonoEmpleado,
                salarioEmpleado: Number(formData.salarioEmpleado),
                codRoles: formData.codRoles,
                email: formData.email,
                password: formData.password
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

    const handleRoleToggle = (codigo: string) => {
        // No permitir desmarcar el rol "Empleado"
        if (codigo === rolEmpleadoCodigo) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            codRoles: prev.codRoles.includes(codigo)
                ? prev.codRoles.filter(r => r !== codigo)
                : [...prev.codRoles, codigo]
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
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {success && (
                    <div style={{ textAlign: 'center' }}>
                        <div className="alert-success" style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '18px', marginBottom: '16px' }}><strong>✓ ¡Empleado creado exitosamente!</strong></p>
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
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {/* Columna izquierda - Campos de texto */}
                            <div style={{ flex: '1' }}>
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
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Mínimo 8 caracteres"
                                                disabled={loading}
                                                className={validationErrors.password ? 'input-error' : ''}
                                                style={{ paddingRight: '40px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    color: '#666',
                                                    padding: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {validationErrors.password && (
                                            <span className="error-text">{validationErrors.password}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Columna derecha - Roles */}
                            <div style={{ flex: '0.8', minWidth: '250px' }}>
                                <div className="form-group">
                                    <label>Roles * (seleccione al menos uno)</label>
                                    <div className="roles-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {rolesDisponibles.map(rol => (
                                            <label key={rol.codigo} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.codRoles.includes(rol.codigo)}
                                                    onChange={() => handleRoleToggle(rol.codigo)}
                                                    disabled={loading || rol.codigo === rolEmpleadoCodigo}
                                                    style={{ cursor: rol.codigo === rolEmpleadoCodigo ? 'not-allowed' : 'pointer' }}
                                                />
                                                <span>
                                                    {rol.nombre}
                                                    {rol.codigo === rolEmpleadoCodigo && <span style={{ marginLeft: '8px', fontSize: '0.85em', color: '#666' }}>(obligatorio)</span>}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {validationErrors.codRoles && (
                                        <span className="error-text">{validationErrors.codRoles}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <Button
                                label="Cancelar"
                                onClick={onClose}
                                disabled={loading}
                            />
                            <Button
                                label={loading ? 'Creando...' : 'Crear Empleado'}
                                disabled={loading}
                                className="btn-primary"
                                onClick={(e) => handleSubmit(e as React.FormEvent<HTMLFormElement>)}
                            />
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
};

export default ModalAltaEmpleado;