// frontend/tan/src/routes/gerencia/components/ModalBajaCliente.tsx
import React, { useState } from 'react';
import { Modal, Button } from '../../../generalComponents';
import './ModalAltaEntidad.css';

interface ClienteBase {
    id: number;
    nombreCliente: string;
    codCliente: string;
    dniCliente: string;
}

interface ModalBajaClienteProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cliente: ClienteBase;
    onConfirm: (id: number) => Promise<void>;
}

interface BajaResponse {
    mensaje: string;
    codCliente: string;
    nombreCliente: string;
    dniCliente: string;
}

const ModalBajaCliente: React.FC<ModalBajaClienteProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    cliente,
    onConfirm 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultado, setResultado] = useState<BajaResponse | null>(null);

    const handleConfirmar = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await onConfirm(cliente.id);
            setResultado({
                mensaje: 'Cliente dado de baja correctamente',
                codCliente: cliente.codCliente,
                nombreCliente: cliente.nombreCliente,
                dniCliente: cliente.dniCliente
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
                                    <strong>Código:</strong> {resultado.codCliente}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Nombre:</strong> {resultado.nombreCliente}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>DNI:</strong> {resultado.dniCliente}
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
                            ¿Está seguro que desea dar de baja al siguiente cliente?
                        </p>

                        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Código:</strong> {cliente.codCliente}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Nombre:</strong> {cliente.nombreCliente}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>DNI:</strong> {cliente.dniCliente}
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

export default ModalBajaCliente;