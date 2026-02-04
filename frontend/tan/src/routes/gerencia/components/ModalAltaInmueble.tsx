// frontend/tan/src/routes/gerencia/components/ModalAltaInmueble.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../generalComponents';
import { useAltaInmueble } from '../hooks/useAltaInmueble';
import { useFetch } from '../../../generalHooks/useFetch';
import './ModalAltaEntidad.css';

interface Cliente {
    id: number;
    codCliente: string;
    nombreCliente: string;
}

interface ModalAltaInmuebleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalAltaInmueble: React.FC<ModalAltaInmuebleProps> = ({ isOpen, onClose, onSuccess }) => {
    const { altaInmueble, loading, error, success, resetState } = useAltaInmueble();
    const { data: clientes } = useFetch<Cliente[]>('/api/clientes/listar');
    
    const [formData, setFormData] = useState({
        cantidadBaños: '',
        cantidadDormitorios: '',
        capacidad: '',
        direccion: '',
        m2Inmueble: '',
        nombreInmueble: '',
        precioPorNocheUSD: '',
        codCliente: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                cantidadBaños: '',
                cantidadDormitorios: '',
                capacidad: '',
                direccion: '',
                m2Inmueble: '',
                nombreInmueble: '',
                precioPorNocheUSD: '',
                codCliente: ''
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

        if (!formData.nombreInmueble.trim()) {
            errors.nombreInmueble = 'El nombre es obligatorio';
        } else if (formData.nombreInmueble.length < 3 || formData.nombreInmueble.length > 100) {
            errors.nombreInmueble = 'El nombre debe tener entre 3 y 100 caracteres';
        }

        if (!formData.direccion.trim()) {
            errors.direccion = 'La dirección es obligatoria';
        } else if (formData.direccion.length < 5 || formData.direccion.length > 200) {
            errors.direccion = 'La dirección debe tener entre 5 y 200 caracteres';
        }

        if (!formData.cantidadBaños) {
            errors.cantidadBaños = 'La cantidad de baños es obligatoria';
        } else if (Number(formData.cantidadBaños) < 1 || Number(formData.cantidadBaños) > 20) {
            errors.cantidadBaños = 'Debe tener entre 1 y 20 baños';
        }

        if (!formData.cantidadDormitorios) {
            errors.cantidadDormitorios = 'La cantidad de dormitorios es obligatoria';
        } else if (Number(formData.cantidadDormitorios) < 1 || Number(formData.cantidadDormitorios) > 20) {
            errors.cantidadDormitorios = 'Debe tener entre 1 y 20 dormitorios';
        }

        if (!formData.capacidad) {
            errors.capacidad = 'La capacidad es obligatoria';
        } else if (Number(formData.capacidad) < 1 || Number(formData.capacidad) > 50) {
            errors.capacidad = 'La capacidad debe estar entre 1 y 50 personas';
        }

        if (!formData.m2Inmueble) {
            errors.m2Inmueble = 'Los m² son obligatorios';
        } else if (Number(formData.m2Inmueble) < 10 || Number(formData.m2Inmueble) > 10000) {
            errors.m2Inmueble = 'Los m² deben estar entre 10 y 10000';
        }

        if (!formData.precioPorNocheUSD) {
            errors.precioPorNocheUSD = 'El precio es obligatorio';
        } else if (Number(formData.precioPorNocheUSD) < 1 || Number(formData.precioPorNocheUSD) > 100000) {
            errors.precioPorNocheUSD = 'El precio debe estar entre 1 y 100000 USD';
        }

        if (!formData.codCliente) {
            errors.codCliente = 'Debe seleccionar un cliente';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await altaInmueble({
                cantidadBaños: Number(formData.cantidadBaños),
                cantidadDormitorios: Number(formData.cantidadDormitorios),
                capacidad: Number(formData.capacidad),
                direccion: formData.direccion,
                m2Inmueble: Number(formData.m2Inmueble),
                nombreInmueble: formData.nombreInmueble,
                precioPorNocheUSD: Number(formData.precioPorNocheUSD),
                codCliente: formData.codCliente
            });
        } catch (err) {
            console.error('Error al crear inmueble:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            title="Crear Nuevo Inmueble"
            description="Complete los datos del nuevo inmueble"
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
                        <p><strong>¡Inmueble creado exitosamente!</strong></p>
                        <p>Código: {success.codInmueble}</p>
                        <p>Nombre: {success.nombreInmueble}</p>
                        <p>Cliente: {success.nombreCliente} ({success.codCliente})</p>
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombreInmueble">Nombre del Inmueble *</label>
                        <input
                            type="text"
                            id="nombreInmueble"
                            name="nombreInmueble"
                            value={formData.nombreInmueble}
                            onChange={handleInputChange}
                            placeholder="Casa de Playa"
                            disabled={loading}
                            className={validationErrors.nombreInmueble ? 'input-error' : ''}
                        />
                        {validationErrors.nombreInmueble && (
                            <span className="error-text">{validationErrors.nombreInmueble}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="codCliente">Cliente *</label>
                        <select
                            id="codCliente"
                            name="codCliente"
                            value={formData.codCliente}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={validationErrors.codCliente ? 'input-error' : ''}
                        >
                            <option value="">Seleccionar cliente</option>
                            {clientes?.map(cliente => (
                                <option key={cliente.codCliente} value={cliente.codCliente}>
                                    {cliente.nombreCliente} ({cliente.codCliente})
                                </option>
                            ))}
                        </select>
                        {validationErrors.codCliente && (
                            <span className="error-text">{validationErrors.codCliente}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="direccion">Dirección *</label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Av. Principal 123"
                        disabled={loading}
                        className={validationErrors.direccion ? 'input-error' : ''}
                    />
                    {validationErrors.direccion && (
                        <span className="error-text">{validationErrors.direccion}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cantidadBaños">Cantidad de Baños *</label>
                        <input
                            type="number"
                            id="cantidadBaños"
                            name="cantidadBaños"
                            value={formData.cantidadBaños}
                            onChange={handleInputChange}
                            placeholder="2"
                            min="1"
                            max="20"
                            disabled={loading}
                            className={validationErrors.cantidadBaños ? 'input-error' : ''}
                        />
                        {validationErrors.cantidadBaños && (
                            <span className="error-text">{validationErrors.cantidadBaños}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cantidadDormitorios">Cantidad de Dormitorios *</label>
                        <input
                            type="number"
                            id="cantidadDormitorios"
                            name="cantidadDormitorios"
                            value={formData.cantidadDormitorios}
                            onChange={handleInputChange}
                            placeholder="3"
                            min="1"
                            max="20"
                            disabled={loading}
                            className={validationErrors.cantidadDormitorios ? 'input-error' : ''}
                        />
                        {validationErrors.cantidadDormitorios && (
                            <span className="error-text">{validationErrors.cantidadDormitorios}</span>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="capacidad">Capacidad (personas) *</label>
                        <input
                            type="number"
                            id="capacidad"
                            name="capacidad"
                            value={formData.capacidad}
                            onChange={handleInputChange}
                            placeholder="6"
                            min="1"
                            max="50"
                            disabled={loading}
                            className={validationErrors.capacidad ? 'input-error' : ''}
                        />
                        {validationErrors.capacidad && (
                            <span className="error-text">{validationErrors.capacidad}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="m2Inmueble">Metros Cuadrados *</label>
                        <input
                            type="number"
                            id="m2Inmueble"
                            name="m2Inmueble"
                            value={formData.m2Inmueble}
                            onChange={handleInputChange}
                            placeholder="120"
                            min="10"
                            max="10000"
                            disabled={loading}
                            className={validationErrors.m2Inmueble ? 'input-error' : ''}
                        />
                        {validationErrors.m2Inmueble && (
                            <span className="error-text">{validationErrors.m2Inmueble}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="precioPorNocheUSD">Precio por Noche (USD) *</label>
                    <input
                        type="number"
                        id="precioPorNocheUSD"
                        name="precioPorNocheUSD"
                        value={formData.precioPorNocheUSD}
                        onChange={handleInputChange}
                        placeholder="150"
                        min="1"
                        max="100000"
                        step="0.01"
                        disabled={loading}
                        className={validationErrors.precioPorNocheUSD ? 'input-error' : ''}
                    />
                    {validationErrors.precioPorNocheUSD && (
                        <span className="error-text">{validationErrors.precioPorNocheUSD}</span>
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
                        label={loading ? 'Creando...' : 'Crear Inmueble'}
                        disabled={loading}
                        className="btn-primary"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalAltaInmueble;