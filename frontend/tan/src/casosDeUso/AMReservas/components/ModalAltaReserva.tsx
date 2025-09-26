import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../generalComponents';
import type { ReservaFormData, Inmueble, MedioReserva } from '../types';
import './ModalAltaReserva.css';

interface ModalAltaReservaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reservaData: ReservaFormData) => Promise<void>;
    inmuebles: Inmueble[];
    mediosReserva: MedioReserva[];
    loading?: boolean;
}

const ModalAltaReserva: React.FC<ModalAltaReservaProps> = ({
    isOpen,
    onClose,
    onSave,
    inmuebles,
    mediosReserva,
    loading = false
}) => {
    const [formData, setFormData] = useState<ReservaFormData>({
        codReserva: '',
        codInmueble: '',
        fechaHoraCheckin: '',
        fechaHoraCheckout: '',
        nombreHuesped: '',
        cantHuespedes: 1,
        plataformaOrigen: '',
        totalMonto: 0,
        totalMontoSenia: 0,
        detalles: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                codReserva: '',
                codInmueble: '',
                fechaHoraCheckin: '',
                fechaHoraCheckout: '',
                nombreHuesped: '',
                cantHuespedes: 1,
                plataformaOrigen: '',
                totalMonto: 0,
                totalMontoSenia: 0,
                detalles: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: name === 'cantHuespedes' || name === 'totalMonto' || name === 'totalMontoSenia'
                ? Number(value) || 0
                : value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.codInmueble) {
            newErrors.codInmueble = 'Debe seleccionar un inmueble';
        }

        if (!formData.fechaHoraCheckin) {
            newErrors.fechaHoraCheckin = 'Debe ingresar la fecha de check-in';
        }

        if (!formData.fechaHoraCheckout) {
            newErrors.fechaHoraCheckout = 'Debe ingresar la fecha de check-out';
        }

        if (formData.fechaHoraCheckin && formData.fechaHoraCheckout && formData.fechaHoraCheckin >= formData.fechaHoraCheckout) {
            newErrors.fechaHoraCheckout = 'La fecha de check-out debe ser posterior a la de check-in';
        }

        if (!formData.nombreHuesped.trim()) {
            newErrors.nombreHuesped = 'Debe ingresar el nombre del huésped';
        }

        if (formData.cantHuespedes < 1) {
            newErrors.cantHuespedes = 'La cantidad de huéspedes debe ser mayor a 0';
        }

        if (!formData.plataformaOrigen) {
            newErrors.plataformaOrigen = 'Debe seleccionar un medio de reserva';
        }

        if (formData.totalMonto < 0) {
            newErrors.totalMonto = 'El monto total debe ser mayor o igual a 0';
        }

        if (formData.totalMontoSenia < 0) {
            newErrors.totalMontoSenia = 'El monto de seña debe ser mayor o igual a 0';
        }

        if (formData.totalMontoSenia > formData.totalMonto) {
            newErrors.totalMontoSenia = 'El monto de seña no puede ser mayor al monto total';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            // Convertir las fechas a formato ISO para el backend
            const reservaData: ReservaFormData = {
                ...formData,
                fechaHoraCheckin: new Date(formData.fechaHoraCheckin).toISOString(),
                fechaHoraCheckout: new Date(formData.fechaHoraCheckout).toISOString(),
            };
            
            await onSave(reservaData);
            onClose();
        } catch (error) {
            console.error('Error saving reservation:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Añadir Nueva Reserva"
            showCloseButton={true}
        >
            <div className="modal-alta-reserva">
                <p className="modal-alta-reserva__description">
                    Las nuevas reservas se crean en estado "Señada" hasta que se asignen empleados para check-in y check-out.
                </p>

                <form onSubmit={handleSubmit} className="form-alta-reserva">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="codInmueble" className="form-label">
                                Inmueble *
                            </label>
                            <select
                                id="codInmueble"
                                name="codInmueble"
                                value={formData.codInmueble}
                                onChange={handleInputChange}
                                className={`form-select ${errors.codInmueble ? 'error' : ''}`}
                            >
                                <option value="">Seleccionar inmueble</option>
                                {inmuebles.map((inmueble) => (
                                    <option key={inmueble.codInmueble} value={inmueble.codInmueble}>
                                        {inmueble.nombreInmueble}
                                    </option>
                                ))}
                            </select>
                            {errors.codInmueble && <span className="error-message">{errors.codInmueble}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fechaHoraCheckin" className="form-label">
                                Fecha de Check-in *
                            </label>
                            <input
                                type="date"
                                id="fechaHoraCheckin"
                                name="fechaHoraCheckin"
                                value={formData.fechaHoraCheckin.split('T')[0]} // Solo la parte de fecha
                                onChange={handleInputChange}
                                className={`form-input ${errors.fechaHoraCheckin ? 'error' : ''}`}
                            />
                            {errors.fechaHoraCheckin && <span className="error-message">{errors.fechaHoraCheckin}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="fechaHoraCheckout" className="form-label">
                                Fecha de Check-out *
                            </label>
                            <input
                                type="date"
                                id="fechaHoraCheckout"
                                name="fechaHoraCheckout"
                                value={formData.fechaHoraCheckout.split('T')[0]} // Solo la parte de fecha
                                onChange={handleInputChange}
                                className={`form-input ${errors.fechaHoraCheckout ? 'error' : ''}`}
                            />
                            {errors.fechaHoraCheckout && <span className="error-message">{errors.fechaHoraCheckout}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombreHuesped" className="form-label">
                                Nombre del Huésped *
                            </label>
                            <input
                                type="text"
                                id="nombreHuesped"
                                name="nombreHuesped"
                                value={formData.nombreHuesped}
                                onChange={handleInputChange}
                                className={`form-input ${errors.nombreHuesped ? 'error' : ''}`}
                                placeholder="Ingrese el nombre del huésped"
                            />
                            {errors.nombreHuesped && <span className="error-message">{errors.nombreHuesped}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cantHuespedes" className="form-label">
                                Cantidad de Huéspedes *
                            </label>
                            <input
                                type="number"
                                id="cantHuespedes"
                                name="cantHuespedes"
                                value={formData.cantHuespedes}
                                onChange={handleInputChange}
                                className={`form-input ${errors.cantHuespedes ? 'error' : ''}`}
                                min="1"
                            />
                            {errors.cantHuespedes && <span className="error-message">{errors.cantHuespedes}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="plataformaOrigen" className="form-label">
                                Medio de Reserva *
                            </label>
                            <select
                                id="plataformaOrigen"
                                name="plataformaOrigen"
                                value={formData.plataformaOrigen}
                                onChange={handleInputChange}
                                className={`form-select ${errors.plataformaOrigen ? 'error' : ''}`}
                            >
                                <option value="">Seleccionar</option>
                                {mediosReserva.map((medio) => (
                                    <option key={medio.id} value={medio.id}>
                                        {medio.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.plataformaOrigen && <span className="error-message">{errors.plataformaOrigen}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="totalMonto" className="form-label">
                                Monto Total
                            </label>
                            <input
                                type="number"
                                id="totalMonto"
                                name="totalMonto"
                                value={formData.totalMonto}
                                onChange={handleInputChange}
                                className={`form-input ${errors.totalMonto ? 'error' : ''}`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                            {errors.totalMonto && <span className="error-message">{errors.totalMonto}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="totalMontoSenia" className="form-label">
                                Monto de Seña
                            </label>
                            <input
                                type="number"
                                id="totalMontoSenia"
                                name="totalMontoSenia"
                                value={formData.totalMontoSenia}
                                onChange={handleInputChange}
                                className={`form-input ${errors.totalMontoSenia ? 'error' : ''}`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                            {errors.totalMontoSenia && <span className="error-message">{errors.totalMontoSenia}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="detalles" className="form-label">
                                Detalles
                            </label>
                            <textarea
                                id="detalles"
                                name="detalles"
                                value={formData.detalles}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={3}
                                placeholder="Detalles adicionales de la reserva..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button 
                            type="submit" 
                            label={loading ? "Guardando..." : "Guardar Reserva"}
                            disabled={loading}
                            id="guardar-reserva-btn"
                        />
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalAltaReserva;