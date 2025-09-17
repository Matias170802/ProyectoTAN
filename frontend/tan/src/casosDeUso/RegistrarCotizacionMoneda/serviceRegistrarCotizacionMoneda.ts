import {type formSchemaRegistrarCotizacionMonedaType} from './models/modelRegistrarCotizacionMoneda';


export const registrarCotizacion = async (cotizacion: formSchemaRegistrarCotizacionMonedaType ): Promise<formSchemaRegistrarCotizacionMonedaType> => {
    const response = await fetch ('/api/finanzas/registrarCotizacionMoneda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cotizacion)
    })

    const result = await response.json();
    console.log("Este es el resultado del back: ", result)
    console.log("este es el response.ok", response.ok)
    console.log("Este es el result.codigo", result.codigo)
    
    //* Si el backend responde con error lógico
    if (!response.ok) {
        console.log("Este es el mensaje del error del back: ", result.mensaje)
        throw new Error(result.message);
    }

    return result;
}