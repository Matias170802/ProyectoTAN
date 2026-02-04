import { type formSchemaRegistrarCambioMonedaType } from "./models/modelRegistrarCambioMoneda";

export const registrarCambioMoneda = async (cambio: formSchemaRegistrarCambioMonedaType ): Promise<formSchemaRegistrarCambioMonedaType> => {
    const response = await fetch ('/api/finanzas/registrarCambioMoneda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') ? localStorage.getItem('access_token') : sessionStorage.getItem('access_token')}`
        },
        body: JSON.stringify(cambio)
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