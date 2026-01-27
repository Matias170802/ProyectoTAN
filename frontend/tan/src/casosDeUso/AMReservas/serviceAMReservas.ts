import type { Reserva, ReservaFormData, Inmueble, MedioReserva, DTOReserva } from './types';

// Base URL para las APIs - ajusta según tu configuración
const API_BASE_URL = '';

// Función para generar código único de reserva
const generateReservationCode = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `RES-${timestamp}-${random.toUpperCase()}`;
};

// Función para convertir ReservaFormData a DTOReserva
const mapFormDataToDTO = (formData: ReservaFormData): DTOReserva => {
    return {
        codReserva: formData.codReserva || generateReservationCode(),
        fechaHoraCheckin: formData.fechaHoraCheckin,
        fechaHoraCheckout: formData.fechaHoraCheckout,
        cantHuespedes: formData.cantHuespedes,
        totalMonto: formData.totalMonto,
        totalMontoSenia: formData.totalMontoSenia,
        plataformaOrigen: formData.plataformaOrigen,
        codInmueble: formData.codInmueble,
        nombreInmueble: (formData as any).nombreInmueble || '',
        nombreHuesped: formData.nombreHuesped,
        emailHuesped: formData.emailHuesped || (formData as any).emailHuesped || '',
        descripcionReserva: formData.descripcionReserva || (formData as any).descripcionReserva || '',
        numeroTelefonoHuesped: formData.numeroTelefonoHuesped || (formData as any).numeroTelefonoHuesped || '',
        totalDias: formData.totalDias || undefined,
    };
};

// Funciones para manejar inmuebles
export const getInmuebles = async (): Promise<Inmueble[]> => {
    try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        const response = await fetch(`${API_BASE_URL}/api/inmuebles/inmuebles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
        })

        if (!response.ok) {
            throw new Error('Error al cargar inmuebles');
        }
        const data: Inmueble[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching inmuebles:', error);
        throw error;
    }
};

// Funciones para manejar medios de reserva (plataformas)
export const getMediosReserva = async (): Promise<MedioReserva[]> => {
    try {
        // Datos mock para medios de reserva
        const mockMedios: MedioReserva[] = [
            { id: "booking", nombre: "Booking.com", descripcion: "Plataforma de reservas online" },
            { id: "airbnb", nombre: "Airbnb", descripcion: "Plataforma de alojamiento" },
            { id: "directo", nombre: "Directo", descripcion: "Reserva directa" },
            { id: "telefono", nombre: "Teléfono", descripcion: "Reserva por teléfono" },
            { id: "email", nombre: "Email", descripcion: "Reserva por email" },
            { id: "presencial", nombre: "Presencial", descripcion: "Reserva presencial" }
        ];
        
        return mockMedios;
    } catch (error) {
        console.error('Error fetching medios de reserva:', error);
        throw error;
    }
};

// Funciones para manejar reservas
export const getReservas = async (): Promise<Reserva[]> => {
    try {

        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        const response = await fetch(`${API_BASE_URL}/api/reservas/reservas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
        })

        if (!response.ok) {
            throw new Error('Error al cargar reservas');
        }

        const data: DTOReserva[] = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching reservas:', error);
        // Retornar array vacío en caso de error
        return [];
    }
};

export const createReserva = async (reservaData: ReservaFormData): Promise<Reserva> => {
    try {
        // Convertir FormData a DTO
        const dtoReserva = mapFormDataToDTO(reservaData);
        
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        const response = await fetch(`${API_BASE_URL}/api/reserva/altaReserva`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dtoReserva)
        });
        const responseText = await response.text();

        // El backend puede devolver mensajes informativos (por ejemplo conflicto de fechas).
        // Detectamos el mensaje y lanzamos error para que la UI lo maneje.
        console.log('Respuesta del servidor (alta):', responseText);
        console.log('Status del servidor:', response.status);
        
        if (!response.ok) {
            // Intentar parsear como JSON si es posible
            let errorMessage = responseText || 'Error al crear la reserva';
            try {
                const jsonError = JSON.parse(responseText);
                errorMessage = jsonError.message || jsonError.mensaje || errorMessage;
            } catch (e) {
                // Si no es JSON, usar el texto tal cual
            }
            throw new Error(errorMessage);
        }

        if (responseText && responseText.toLowerCase().includes('ya existe una reserva')) {
            throw new Error(responseText);
        }

        // Construir la reserva basada en lo que enviamos (el backend actualmente no devuelve la entidad completa)
        const nuevaReserva: Reserva = {
            ...dtoReserva,
            nombreEstadoReserva: 'Señada',
            fechaHoraAltaReserva: new Date().toISOString(),
            totalDias: Math.ceil((new Date(dtoReserva.fechaHoraCheckout).getTime() - new Date(dtoReserva.fechaHoraCheckin).getTime()) / (1000 * 60 * 60 * 24))
        };

        return nuevaReserva;
    } catch (error) {
        console.error('Error creating reserva:', error);
        throw error;
    }
};

// Implementación de actualizar reserva (PATCH)
export const updateReserva = async (codReserva: string, reservaData: Partial<ReservaFormData> | any): Promise<Reserva> => {
    try {
        // Mapear los campos que enviaremos al backend según DTOModificarReserva
        const payload: any = {};
        if (reservaData.fechaHoraCheckin) payload.fechaHoraInicioReserva = reservaData.fechaHoraCheckin;
        if (reservaData.fechaHoraCheckout) payload.fechaHoraFinReserva = reservaData.fechaHoraCheckout;
        if (typeof reservaData.totalDias !== 'undefined') payload.totalDias = reservaData.totalDias;
        if (typeof reservaData.cantHuespedes !== 'undefined') payload.cantidadHuespedes = reservaData.cantHuespedes;
        if (reservaData.nombreHuesped) payload.nombreHuesped = reservaData.nombreHuesped;
        if (reservaData.numeroTelefonoHuesped) payload.numeroTelefonoHuesped = reservaData.numeroTelefonoHuesped;
        if (reservaData.emailHuesped) payload.emailHuesped = reservaData.emailHuesped;
        if (typeof reservaData.totalMonto !== 'undefined') payload.totalMonto = reservaData.totalMonto;
        if (typeof reservaData.totalMontoCheckIn !== 'undefined') payload.totalMontoCheckIn = reservaData.totalMontoCheckIn;
        if (typeof reservaData.totalMontoSenia !== 'undefined') payload.totalMontoSenia = reservaData.totalMontoSenia;
        if (reservaData.plataformaOrigen) payload.plataformaOrigen = reservaData.plataformaOrigen;
        if (reservaData.descripcionReserva) payload.descripcionReserva = reservaData.descripcionReserva;

        const response = await fetch(`${API_BASE_URL}/api/reserva/reservas/${encodeURIComponent(codReserva)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('Respuesta del servidor (modificar):', responseText);

        if (!response.ok) {
            throw new Error(responseText || 'Error al modificar la reserva');
        }

        if (responseText && responseText.toLowerCase().includes('ya existe una reserva')) {
            throw new Error(responseText);
        }

        // Como el backend devuelve solo un mensaje, reconstruimos la reserva con los datos enviados
        const reservaActualizada: Reserva = {
            codReserva,
            fechaHoraCheckin: reservaData.fechaHoraCheckin || reservaData.fechaHoraInicioReserva || '',
            fechaHoraCheckout: reservaData.fechaHoraCheckout || reservaData.fechaHoraFinReserva || '',
            totalDias: reservaData.totalDias,
            cantHuespedes: reservaData.cantHuespedes || reservaData.cantidadHuespedes || 0,
            totalMonto: reservaData.totalMonto || 0,
            totalMontoSenia: reservaData.totalMontoSenia || 0,
            plataformaOrigen: reservaData.plataformaOrigen || '',
            codInmueble: reservaData.codInmueble || '',
            nombreHuesped: reservaData.nombreHuesped || '',
            emailHuesped: reservaData.emailHuesped || '',
            descripcionReserva: reservaData.descripcionReserva || '',
            numeroTelefonoHuesped: reservaData.numeroTelefonoHuesped || '',
            nombreEstadoReserva: 'Señada'
        };

        return reservaActualizada;
    } catch (error) {
        console.error('Error updating reserva:', error);
        throw error;
    }
};



export const deleteReserva = async (codReserva: string): Promise<void> => {
    try {
        // TODO: Implementar cuando el backend tenga endpoint de eliminación
        console.warn('deleteReserva no implementado. codReserva:', codReserva);
        throw new Error('Funcionalidad de eliminación no implementada en el backend');
    } catch (error) {
        console.error('Error deleting reserva:', error);
        throw error;
    }
};

// Función para cancelar una reserva (PATCH -> /api/reserva/cancelarReserva/{codReserva})
export const cancelarReserva = async (codReserva: string): Promise<string> => {
    try {
        console.log('[serviceAMReservas] Cancelling reserva:', codReserva);
        const response = await fetch(`${API_BASE_URL}/api/reserva/cancelarReserva/${encodeURIComponent(codReserva)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseText = await response.text();
        console.log('[serviceAMReservas] cancelarReserva response:', response.status, responseText);
        if (!response.ok) {
            throw new Error(responseText || 'Error al cancelar la reserva');
        }

        return responseText;
    } catch (error) {
        console.error('Error cancelling reserva:', error);
        throw error;
    }
};

// Obtener estados desde backend
export const getEstadosReserva = async (): Promise<{ codEstadoReserva: string; nombreEstadoReserva: string }[]> => {
    try {
        // Endpoint moved to Reservas controller: GET /api/reservas/estados
        const response = await fetch(`${API_BASE_URL}/api/reservas/estados`);
        if (!response.ok) {
            throw new Error('Error al cargar estados');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching estados:', error);
        return [];
    }
};