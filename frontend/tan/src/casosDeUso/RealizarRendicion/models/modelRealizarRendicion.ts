import {z} from "zod";

export const schemaRealizarRendicion = z.object({
    tipoRendicion: z.string().min(1, "Debe seleccionar un tipo rendicion").refine(val => val !== "SeleccioneUnTipoRendicion", { 
        message: "Debe seleccionar un tipo rendicion válido" 
    }),
    
    // Campos opcionales
    empleadoSeleccionado: z.string().optional(),
    inmuebleSeleccionado: z.string().optional(),
    
}).refine((data) => {
    // Validación condicional
    if (data.tipoRendicion === "RendicionEmpleado") {
        return data.empleadoSeleccionado && data.empleadoSeleccionado !== "seleccioneUnEmpleado";
    }
    if (data.tipoRendicion === "RendicionInmueble") {
        return data.inmuebleSeleccionado && data.inmuebleSeleccionado !== "seleccioneUnInmueble";
    }
    return true;
}, {
    message: "Debe seleccionar un empleado o inmueble según el tipo de rendición",
    path: ["empleadoSeleccionado"] // El error se mostrará en este campo
});

export type formSchemaRealizarRendicionType = z.infer<typeof schemaRealizarRendicion>;