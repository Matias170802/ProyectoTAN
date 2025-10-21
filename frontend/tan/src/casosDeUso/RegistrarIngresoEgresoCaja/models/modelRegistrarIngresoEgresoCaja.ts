import {z} from "zod";

export const schemaRegistrarIngresoEgresoCaja = z.object({
    
    tipoTransaccion: z.string().min(1, "Debe seleccionar un tipo de transacción").refine(val => val !== "Selecciona un tipo de transacción", { message: "Debe seleccionar un tipo de transacción válida" }),
    //categoria: z.string().min(1, "Debe seleccionar una categoría").refine(val => val !== "Selecciona una categoría", { message: "Debe seleccionar una categoría válida" }),
    //subcategoria: z.string().min(1, "Debe seleccionar una subcategoría").refine(val => val !== "Selecciona una subcategoría", { message: "Debe seleccionar una subcategoría válida" }),
    categoria: z.string().min(1, "Debe seleccionar un tipo de operación").refine(val => val !== "Selecciona un tipo de operación", { message: "Debe seleccionar un tipo de operación válida" }),
    monto: z.coerce.number().min(0.01, "El monto debe ser mayor a 0").max(10000, "El monto no puede ser mayor a 10000000"),
    descripcion: z.string().max(1000, "La descripcion no pueden superar los 1000 caracteres").optional().or(z.literal('')),
    moneda: z.string().min(1, "Debe seleccionar una moneda").refine(val => val !== "Selecciona una moneda", { message: "Debe seleccionar una moneda válida" })
})

export type formSchemaRegistrarIngresoEgresoCajaType = z.infer<typeof schemaRegistrarIngresoEgresoCaja>;