import React, { createContext, useContext, useState, useEffect } from 'react';

//*archivo para manejar el contexto global de la aplicacion
//TODO: ACTUALIZAR SEGUN LO QUE SE NECESITE, ES UN EJEMPLO ESTO

//* Interfaces
interface Opcion {
    id: number;
    nombreOpcion: string;
}

interface Paso {
    id: number;
    numeroPaso: number;
    textoMensaje: string;
    tipoMensaje: string;
    opcionOrigen: string;
    opcionDestino: string[];
}

interface Configuracion {
    numeroConfiguracionMensaje: number | string;
    fechaHoraAltaConfiguracionMensaje: Date;
    tipoConfiguracionMensaje: string;
    fechaHoraBajaConfiguracionMensaje: Date | null;
}

//* Context Type
interface AppContextType {
    //* Opciones
    opciones: Opcion[];
    addOpcion: (opcion: Opcion) => void;
    refreshOpciones: () => Promise<void>;
    
    //* Pasos
    pasos: Paso[];
    addPaso: (paso: Paso) => void;
    refreshPasos: () => Promise<void>;
    
    //* Configuraciones
    configuraciones: Configuracion[];
    addConfiguracion: (config: Configuracion) => void;
    refreshConfiguraciones: () => Promise<void>;
    
    //* Estados de carga
    isLoadingOpciones: boolean;
    isLoadingPasos: boolean;
    isLoadingConfiguraciones: boolean;

    //*estados de error
    errorOpciones: string | null;
    errorPasos: string | null;
    errorConfiguraciones: string | null;
}

//*Se crea el contexto
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    //* Estados
    const [opciones, setOpciones] = useState<Opcion[]>([]);
    const [pasos, setPasos] = useState<Paso[]>([]);
    const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
    
    //* Estados de carga
    const [isLoadingOpciones, setIsLoadingOpciones] = useState(false);
    const [isLoadingPasos, setIsLoadingPasos] = useState(false);
    const [isLoadingConfiguraciones, setIsLoadingConfiguraciones] = useState(false);

    //* Estados de error
    const [errorOpciones, setErrorOpciones] = useState<string | null>(null);
    const [errorPasos, setErrorPasos] = useState<string | null>(null);
    const [errorConfiguraciones, setErrorConfiguraciones] = useState<string | null>(null);

    //* OPCIONES
    const fetchOpciones = async () => {
        setIsLoadingOpciones(true);
        setErrorOpciones(null);

        try {
            const response = await fetch('/api/buscarOpciones');
            if (response.ok) {
                const data = await response.json();
                setOpciones(data);
            }
        } catch (error) {
            console.error('Error al cargar opciones:', error);
            setErrorOpciones(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoadingOpciones(false);
        }
    };

    const refreshOpciones = async () => {
        await fetchOpciones();
    };

    const addOpcion = (nuevaOpcion: Opcion) => {
        setOpciones(prev => [...prev, nuevaOpcion]);
    };

    // PASOS
    const fetchPasos = async () => {
        setIsLoadingPasos(true);
        setErrorPasos(null);

        try {
            const response = await fetch('/api/pasos'); // Ajusta según tu endpoint
            if (response.ok) {
                const data = await response.json();
                setPasos(data);
            }
        } catch (error) {
            console.error('Error al cargar pasos:', error);
            setErrorPasos(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoadingPasos(false);
        }
    };

    const refreshPasos = async () => {
        await fetchPasos();
    };

    const addPaso = (nuevoPaso: Paso) => {
        setPasos(prev => [...prev, nuevoPaso]);
    };

    // CONFIGURACIONES
    const fetchConfiguraciones = async () => {
        setIsLoadingConfiguraciones(true);
        setErrorConfiguraciones(null);

        try {
            const response = await fetch('/api/inicio');
            if (response.ok) {
                const data = await response.json();
                setConfiguraciones(data);
            }
        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
            setErrorConfiguraciones(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoadingConfiguraciones(false);
        }
    };

    const refreshConfiguraciones = async () => {
        await fetchConfiguraciones();
    };

    const addConfiguracion = (nuevaConfiguracion: Configuracion) => {
        setConfiguraciones(prev => [...prev, nuevaConfiguracion]);
    };

    //* Cargar datos iniciales
    useEffect(() => {
        fetchOpciones();
        fetchPasos();
        fetchConfiguraciones();
    }, []);

    return (
        //* Permite que cualquier componente childreb tenga acceso al contexto}
        <AppContext.Provider value={{
            //* Opciones
            opciones,
            addOpcion,
            refreshOpciones,
            
            //* Pasos
            pasos,
            addPaso,
            refreshPasos,
            
            //* Configuraciones
            configuraciones,
            addConfiguracion,
            refreshConfiguraciones,
            
            //* Estados de carga
            isLoadingOpciones,
            isLoadingPasos,
            isLoadingConfiguraciones,

            //*estados de error
            errorOpciones,
            errorPasos,
            errorConfiguraciones
        }}>
            {children}
        </AppContext.Provider>
    );
};
