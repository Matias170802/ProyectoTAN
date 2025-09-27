import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Modal, Button } from '../../../generalComponents';
import type { DTOReserva, Inmueble, MedioReserva } from '../types';
import './ModalAltaReserva.css';

interface ModalAltaReservaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reservaData: any) => Promise<void>; // Permitir ReservaFormData o DTOReserva
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
    const [formData, setFormData] = useState<any>({
        codReserva: '',
        fechaHoraCheckin: '',
        fechaHoraCheckout: '',
        fechaHoraAltaReserva: '',
        totalDias: 0,
        cantHuespedes: 1,
        totalMonto: 0,
        totalMontoSenia: 0,
        plataformaOrigen: '',
        codInmueble: '',
        nombreInmueble: '',
        codEstadoReserva: '',
        nombreEstadoReserva: '',
        nombreHuesped: '',
        numeroTelefonoHuesped: '',
        emailHuesped: '',
        descripcionReserva: '',
    });

    // Estado para el rango de fechas visual
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);
    const [showDateRange, setShowDateRange] = useState(true);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                codReserva: '',
                fechaHoraCheckin: '',
                fechaHoraCheckout: '',
                fechaHoraAltaReserva: '',
                totalDias: 0,
                cantHuespedes: 1,
                totalMonto: 0,
                totalMontoSenia: 0,
                plataformaOrigen: '',
                codInmueble: '',
                nombreInmueble: '',
                codEstadoReserva: '',
                nombreEstadoReserva: '',
                nombreHuesped: '',
                numeroTelefonoHuesped: '',
                emailHuesped: '',
                descripcionReserva: '',
            });
            setDateRange([
                {
                    startDate: null,
                    endDate: null,
                    key: 'selection',
                },
            ]);
            setErrors({});
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    setFormData((prev: any) => ({
            ...prev,
            [name]: ['cantHuespedes', 'totalMonto', 'totalMontoSenia', 'totalDias'].includes(name)
                ? Number(value) || 0
                : value
        }));
    };

    // Manejar el cambio de rango de fechas visual
    const handleDateRangeChange = (ranges: any) => {
        const { startDate, endDate } = ranges.selection;
        setDateRange([ranges.selection]);
        setFormData((prev: any) => ({
            ...prev,
            fechaHoraCheckin: startDate ? new Date(startDate).toISOString() : '',
            fechaHoraCheckout: endDate ? new Date(endDate).toISOString() : '',
        }));
        // Solo cerrar si ambos extremos están definidos y son diferentes
        if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
            setShowDateRange(false);
        }
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
            // Calcular totalDias y fechaHoraAltaReserva
            const checkin = new Date(formData.fechaHoraCheckin);
            const checkout = new Date(formData.fechaHoraCheckout);
            const totalDias = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
            const reservaDTO: DTOReserva = {
                codReserva: formData.codReserva,
                fechaHoraCheckin: checkin.toISOString(),
                fechaHoraCheckout: checkout.toISOString(),
                fechaHoraAltaReserva: new Date().toISOString(),
                totalDias,
                cantHuespedes: formData.cantHuespedes,
                totalMonto: formData.totalMonto,
                totalMontoSenia: formData.totalMontoSenia,
                plataformaOrigen: formData.plataformaOrigen,
                codInmueble: formData.codInmueble,
                nombreInmueble: inmuebles.find(i => i.codInmueble === formData.codInmueble)?.nombreInmueble || '',
                codEstadoReserva: formData.codEstadoReserva,
                nombreEstadoReserva: 'Señada',
                nombreHuesped: formData.nombreHuesped,
                emailHuesped: formData.emailHuesped,
                descripcionReserva: formData.descripcionReserva,
                numeroTelefonoHuesped: formData.numeroTelefonoHuesped,
            };
            await onSave(reservaDTO);
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
            showCloseButton={false}
            wide={true}
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
                    <div className="form-row" style={{ gridColumn: '1 / -1', width: '100%', display: 'block' }}>
                        <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>
                                Fechas de Check-in y Check-out *
                            </label>
                            {showDateRange ? (
                                <div style={{ width: '100%' }}>
                                    <DateRange
                                        ranges={dateRange}
                                        onChange={handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        minDate={new Date()}
                                        rangeColors={["#294f75ff"]}
                                        showMonthAndYearPickers={true}
                                        showDateDisplay={false}
                                        months={1}
                                        direction="horizontal"
                                        locale={undefined}
                                        style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}
                                    />
                                </div>
                            ) : (
                                <div style={{ margin: '16px 0' }}>
                                    <button type="button" className="btn-fecha" onClick={() => setShowDateRange(true)}>
                                        Cambiar fechas
                                    </button>
                                    <div style={{ fontSize: '1rem', marginTop: 8 }}>
                                        {dateRange[0].startDate && dateRange[0].endDate
                                            ? `${new Date(dateRange[0].startDate).toLocaleDateString()} - ${new Date(dateRange[0].endDate).toLocaleDateString()}`
                                            : 'Selecciona un rango'}
                                    </div>
                                </div>
                            )}
                            {(errors.fechaHoraCheckin || errors.fechaHoraCheckout) && (
                                <span className="error-message">
                                    {errors.fechaHoraCheckin || errors.fechaHoraCheckout}
                                </span>
                            )}
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
                    {/* Campos adicionales */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombreHuesped" className="form-label">
                                Nombre del Huésped
                            </label>
                            <input
                                type="text"
                                id="nombreHuesped"
                                name="nombreHuesped"
                                value={formData.nombreHuesped}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ingrese el nombre del huésped"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="numeroTelefonoHuesped" className="form-label">
                                Teléfono del Huésped
                            </label>
                            <input
                                type="text"
                                id="numeroTelefonoHuesped"
                                name="numeroTelefonoHuesped"
                                value={formData.numeroTelefonoHuesped}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ej: 2611234567"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="emailHuesped" className="form-label">
                                Email del Huésped
                            </label>
                            <input
                                type="email"
                                id="emailHuesped"
                                name="emailHuesped"
                                value={formData.emailHuesped}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="ejemplo@email.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcionReserva" className="form-label">
                                Descripción de la Reserva
                            </label>
                            <textarea
                                id="descripcionReserva"
                                name="descripcionReserva"
                                value={formData.descripcionReserva}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={2}
                                placeholder="Detalles adicionales de la reserva..."
                            />
                        </div>
                    </div>
                    {/* Botones de acción */}
                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancelar"
                            onClick={onClose}
                        />
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