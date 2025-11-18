import React from 'react';
import { Modal, Button } from '../../../generalComponents';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    codReserva: string | null;
    onConfirm: (codReserva: string) => Promise<void>;
    loading?: boolean;
}

const ModalConfirmarCancelar: React.FC<Props> = ({ isOpen, onClose, codReserva, onConfirm, loading = false }) => {
    const handleConfirm = async () => {
        if (!codReserva) return;
        await onConfirm(codReserva);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirmar cancelación"
            showCloseButton={true}
        >
            <div style={{ padding: 8 }}>
                <p>¿Estás seguro que deseas cancelar la reserva <strong>{codReserva}</strong>?</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                    <Button type="button" label="No" onClick={onClose} />
                    <Button type="button" label={loading ? 'Cancelando...' : 'Sí, cancelar'} onClick={handleConfirm} disabled={loading} />
                </div>
            </div>
        </Modal>
    );
};

export default ModalConfirmarCancelar;
