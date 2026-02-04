import type { formSchemaRegistrarIngresoEgresoCajaType } from "./models/modelRegistrarIngresoEgresoCaja";


export const registrarIngresoEgreso = async (ingresoEgresoCaja: formSchemaRegistrarIngresoEgresoCajaType ): Promise<formSchemaRegistrarIngresoEgresoCajaType> => {
    
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    
    const response = await fetch ('/api/finanzas/registrarIngresoEgresoCaja', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ingresoEgresoCaja)
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


