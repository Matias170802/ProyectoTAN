import type { formSchemaRegistrarIngresoEgresoCajaType } from "./models/modelRegistrarIngresoEgresoCaja";


export const registrarIngresoEgreso = async (ingresoEgresoCaja: formSchemaRegistrarIngresoEgresoCajaType ): Promise<formSchemaRegistrarIngresoEgresoCajaType> => {
    
    const response = await fetch ('/api/finanzas/registrarIngresoEgresoCaja', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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


