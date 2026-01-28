// frontend/tan/src/routes/gerencia/components/ModalBajaInmueble.tsx
import React, { useState } from 'react';
import { Modal, Button } from '../../../generalComponents';
import './ModalAltaEntidad.css';

interface InmuebleBase {
    id: number;
    nombreInmueble: string;
    codInmueble: string;
    direccion: string;
    nombreCliente: string;
}

interface ModalBajaInmuebleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    inmueble: InmuebleBase;
    onConfirm: (id: number) => Promise<void>;
}

interface BajaResponse {
    mensaje: string;
    codInmueble: string;
    nombreInmueble: string;
    direccion: string;
    nombreCliente: string;
}

const ModalBajaInmueble: React.FC<ModalBajaInmuebleProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    inmueble,
    onConfirm 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultado, setResultado] = useState<BajaResponse | null>(null);

    const handleConfirmar = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await onConfirm(inmueble.id);
            setResultado({
                mensaje: 'Inmueble dado de baja correctamente',
                codInmueble: inmueble.codInmueble,
                nombreInmueble: inmueble.nombreInmueble,
                direccion: inmueble.direccion,
                nombreCliente: inmueble.nombreCliente
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAceptar = () => {
        onSuccess();
        onClose();
        setResultado(null);
        setError(null);
    };

    const handleCancelar = () => {
        onClose();
        setResultado(null);
        setError(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancelar}
            title={resultado ? "Resultado" : "Confirmar Baja"}
            showCloseButton={true}
        >
            <div className="modal-alta-form">
                {resultado ? (
                    <div style={{ textAlign: 'center' }}>
                        <div className="alert-success" style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                                <strong>✓ {resultado.mensaje}</strong>
                            </p>
                            <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Código:</strong> {resultado.codInmueble}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Nombre:</strong> {resultado.nombreInmueble}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Dirección:</strong> {resultado.direccion}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Cliente:</strong> {resultado.nombreCliente}
                                </p>
                            </div>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <Button
                                label="Aceptar"
                                onClick={handleAceptar}
                                className="btn-primary"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="alert-error">
                                {error}
                            </div>
                        )}

                        <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                            ¿Está seguro que desea dar de baja el siguiente inmueble?
                        </p>

                        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Código:</strong> {inmueble.codInmueble}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Nombre:</strong> {inmueble.nombreInmueble}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Dirección:</strong> {inmueble.direccion}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Cliente:</strong> {inmueble.nombreCliente}
                            </p>
                        </div>

                        <div className="form-actions">
                            <Button
                                label="Cancelar"
                                onClick={handleCancelar}
                                disabled={loading}
                            />
                            <Button
                                label={loading ? 'Procesando...' : 'Confirmar Baja'}
                                onClick={handleConfirmar}
                                disabled={loading}
                                className="btn-primary"
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ModalBajaInmueble;