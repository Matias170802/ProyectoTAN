import { useState, useEffect } from 'react';
import type { ReservaFormData, ReservaState } from '../types';
import { 
    getReservas, 
    createReserva, 
    updateReserva, 
    deleteReserva,
    getInmuebles,
    getMediosReserva,
    getEstadosReserva
} from '../serviceAMReservas';

export const useReservas = () => {
    const [state, setState] = useState<ReservaState>({
        reservas: [],
        inmuebles: [],
        mediosReserva: [],
        estados: [],
        loading: false,
        error: null
    });

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const [reservasData, inmueblesData, mediosData, estadosData] = await Promise.all([
                getReservas(),
                getInmuebles(),
                getMediosReserva(),
                getEstadosReserva()
            ]);

            setState(prev => ({
                ...prev,
                reservas: reservasData,
                inmuebles: inmueblesData,
                mediosReserva: mediosData,
                estados: estadosData,
                loading: false
            }));
        } catch (error) {
            console.error('Error loading initial data:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al cargar los datos iniciales'
            }));
        }
    };

    const createNewReserva = async (reservaData: ReservaFormData): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            await createReserva(reservaData);
            // Tras crear, recargar desde backend para tener la versión canónica
            const reservasData = await getReservas();
            setState(prev => ({
                ...prev,
                reservas: reservasData,
                loading: false
            }));
        } catch (error) {
            console.error('Error creating reservation:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al crear la reserva'
            }));
            throw error;
        }
    };

    const updateExistingReserva = async (codReserva: string, reservaData: Partial<ReservaFormData>): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const updatedReserva = await updateReserva(codReserva, reservaData);
            setState(prev => ({
                ...prev,
                reservas: prev.reservas.map(r => r.codReserva === codReserva ? updatedReserva : r),
                loading: false
            }));
        } catch (error) {
            console.error('Error updating reservation:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al actualizar la reserva'
            }));
            throw error;
        }
    };

    const deleteExistingReserva = async (codReserva: string): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            await deleteReserva(codReserva);
            setState(prev => ({
                ...prev,
                reservas: prev.reservas.filter(r => r.codReserva !== codReserva),
                loading: false
            }));
        } catch (error) {
            console.error('Error deleting reservation:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al eliminar la reserva'
            }));
            throw error;
        }
    };

    const refreshReservas = async (): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const reservasData = await getReservas();
            setState(prev => ({
                ...prev,
                reservas: reservasData,
                loading: false
            }));
        } catch (error) {
            console.error('Error refreshing reservations:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al actualizar las reservas'
            }));
        }
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    // Helper functions for filtering and searching
    const getReservasByEstado = (estado: string) => {
        return state.reservas.filter(reserva => reserva.nombreEstadoReserva === estado);
    };

    const getReservasByDateRange = (startDate: string, endDate: string) => {
        return state.reservas.filter(reserva => {
            const checkIn = new Date(reserva.fechaHoraCheckin);
            const checkOut = new Date(reserva.fechaHoraCheckout);
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            return (checkIn >= start && checkIn <= end) || 
                   (checkOut >= start && checkOut <= end) ||
                   (checkIn <= start && checkOut >= end);
        });
    };

    const searchReservas = (query: string) => {
        const lowerQuery = query.toLowerCase();
        return state.reservas.filter(reserva => 
            (reserva.nombreHuesped && reserva.nombreHuesped.toLowerCase().includes(lowerQuery)) ||
            (reserva.nombreInmueble && reserva.nombreInmueble.toLowerCase().includes(lowerQuery)) ||
            (reserva.plataformaOrigen && reserva.plataformaOrigen.toLowerCase().includes(lowerQuery))
        );
    };

    return {
        // State
        reservas: state.reservas,
    inmuebles: state.inmuebles,
    mediosReserva: state.mediosReserva,
    estados: state.estados,
        loading: state.loading,
        error: state.error,

        // Actions
        createReserva: createNewReserva,
        updateReserva: updateExistingReserva,
        deleteReserva: deleteExistingReserva,
        refreshReservas,
        clearError,

        // Helper functions
        getReservasByEstado,
        getReservasByDateRange,
        searchReservas,

        // Reload initial data
        reloadData: loadInitialData
    };
};