// frontend/tan/src/routes/gerencia/components/ModalBajaEmpleado.tsx
import React, { useState } from 'react';
import { Modal, Button } from '../../../generalComponents';
import './ModalAltaEntidad.css';

interface EmpleadoBase {
    id: number;
    nombreEmpleado: string;
    codEmpleado: string;
    dniEmpleado: string;
}

interface ModalBajaEmpleadoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    empleado: EmpleadoBase;
    onConfirm: (id: number) => Promise<void>;
}

interface BajaResponse {
    mensaje: string;
    codEmpleado: string;
    nombreEmpleado: string;
    dniEmpleado: string;
}

const ModalBajaEmpleado: React.FC<ModalBajaEmpleadoProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    empleado,
    onConfirm 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultado, setResultado] = useState<BajaResponse | null>(null);

    const handleConfirmar = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await onConfirm(empleado.id);
            setResultado({
                mensaje: 'Empleado dado de baja correctamente',
                codEmpleado: empleado.codEmpleado,
                nombreEmpleado: empleado.nombreEmpleado,
                dniEmpleado: empleado.dniEmpleado
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
                                    <strong>Código:</strong> {resultado.codEmpleado}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>Nombre:</strong> {resultado.nombreEmpleado}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>DNI:</strong> {resultado.dniEmpleado}
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
                            ¿Está seguro que desea dar de baja al siguiente empleado?
                        </p>

                        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Código:</strong> {empleado.codEmpleado}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>Nombre:</strong> {empleado.nombreEmpleado}
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                <strong>DNI:</strong> {empleado.dniEmpleado}
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

export default ModalBajaEmpleado;