import type { Reserva, ReservaFormData, Inmueble, MedioReserva, DTOReserva } from './types';

// Base URL para las APIs - ajusta según tu configuración
const API_BASE_URL = 'http://localhost:8080';

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
        // Por ahora usamos datos mock ya que no hay endpoint específico para inmuebles
        // TODO: Crear endpoint en el backend para obtener inmuebles
        const mockInmuebles: Inmueble[] = [
            { 
                codInmueble: "INM001", 
                nombreInmueble: "Casa de Playa", 
                capacidad: 6,
                precioPorNocheUSD: 150
            },
            { 
                codInmueble: "INM002", 
                nombreInmueble: "Departamento Centro", 
                capacidad: 4,
                precioPorNocheUSD: 100
            },
            { 
                codInmueble: "INM003", 
                nombreInmueble: "Cabaña Montaña", 
                capacidad: 8,
                precioPorNocheUSD: 200
            },
            { 
                codInmueble: "INM004", 
                nombreInmueble: "Loft Urbano", 
                capacidad: 2,
                precioPorNocheUSD: 80
            }
        ];
        
        return mockInmuebles;
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
        const response = await fetch(`${API_BASE_URL}/api/reservas/reservas`);
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
        
        const response = await fetch(`${API_BASE_URL}/api/reserva/altaReserva`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dtoReserva)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al crear la reserva: ${errorText}`);
        }
        
        // El backend devuelve un string "Reserva Creada", pero nosotros necesitamos 
        // devolver la reserva creada para actualizar el estado
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);
        
        // Crear un objeto reserva basado en los datos enviados
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

export const updateReserva = async (codReserva: string, reservaData: Partial<ReservaFormData>): Promise<Reserva> => {
    try {
        // TODO: Implementar cuando el backend tenga endpoint de actualización
        throw new Error('Funcionalidad de actualización no implementada en el backend');
    } catch (error) {
        console.error('Error updating reserva:', error);
        throw error;
    }
};

export const deleteReserva = async (codReserva: string): Promise<void> => {
    try {
        // TODO: Implementar cuando el backend tenga endpoint de eliminación
        throw new Error('Funcionalidad de eliminación no implementada en el backend');
    } catch (error) {
        console.error('Error deleting reserva:', error);
        throw error;
    }
};