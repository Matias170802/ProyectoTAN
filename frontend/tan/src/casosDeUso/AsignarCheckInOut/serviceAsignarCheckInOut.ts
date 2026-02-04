import type { DTOTarea, Empleado } from './types';

// Obtener lista de empleados
export const getEmpleados = async (): Promise<Empleado[]> => {
    try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        const response = await fetch(`/api/administrador/empleados`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar empleados');
        }
        const data = await response.json();
        // Mapear los datos según la estructura del backend
        return data.map((emp: any) => ({
            codEmpleado: emp.codEmpleado,
            nombreEmpleado: emp.nombreEmpleado || `${emp.apellidoEmpleado || ''} ${emp.nombreEmpleado || ''}`.trim(),
            apellidoEmpleado: emp.apellidoEmpleado,
            emailEmpleado: emp.emailEmpleado,
        }));
    } catch (error) {
        console.error('Error fetching empleados:', error);
        throw error;
    }
};

// Asignar check-in
export const asignarCheckIn = async (dtoTarea: DTOTarea): Promise<string> => {
    try {
        console.log('[asignarCheckIn] Enviando DTO:', dtoTarea);

        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        const response = await fetch(`/api/reserva/asignarCheckInOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`                
            },
            body: JSON.stringify(dtoTarea),
        });

        const responseText = await response.text();
        console.log('[asignarCheckIn] Status:', response.status);
        console.log('[asignarCheckIn] Respuesta:', responseText);

        if (!response.ok) {
            console.error('[asignarCheckIn] Error Response:', responseText);
            throw new Error(responseText || `Error al asignar check-in (${response.status})`);
        }

        console.log('[asignarCheckIn] ✅ Éxito');
        return responseText;
    } catch (error) {
        console.error('[asignarCheckIn] Error completo:', error);
        throw error;
    }
};

// Asignar check-out
export const asignarCheckOut = async (dtoTarea: DTOTarea): Promise<string> => {
    try {
        console.log('[asignarCheckOut] Enviando DTO:', dtoTarea);

        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        const response = await fetch(`/api/reserva/asignarCheckInOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dtoTarea),
        });

        const responseText = await response.text();
        console.log('[asignarCheckOut] Status:', response.status);
        console.log('[asignarCheckOut] Respuesta:', responseText);

        if (!response.ok) {
            console.error('[asignarCheckOut] Error Response:', responseText);
            throw new Error(responseText || `Error al asignar check-out (${response.status})`);
        }

        console.log('[asignarCheckOut] ✅ Éxito');
        return responseText;
    } catch (error) {
        console.error('[asignarCheckOut] Error completo:', error);
        throw error;
    }
};
