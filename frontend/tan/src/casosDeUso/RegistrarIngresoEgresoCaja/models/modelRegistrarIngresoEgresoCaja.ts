import {z} from "zod";

export const schemaRegistrarIngresoEgresoCaja = z.object({
    
    tipoTransaccion: z.string().min(1, "Debe seleccionar un tipo de transacción").refine(val => val !== "Selecciona un tipo de transacción", { message: "Debe seleccionar un tipo de transacción válida" }),
    categoria: z.string().min(1, "Debe seleccionar una categoría").refine(val => val !== "Selecciona una categoría", { message: "Debe seleccionar una categoría válida" }),
    monto: z.coerce.number()
        .refine(val => !isNaN(val), "Debe ingresar un número válido")
        .refine(val => val > 0, "El monto debe ser mayor a 0")
        .refine(val => val <= 10000000, "El monto no puede ser mayor a 10000000"),
    descripcion: z.string().max(1000, "La descripcion no pueden superar los 1000 caracteres").optional().or(z.literal('')),
    moneda: z.string().min(1, "Debe seleccionar una moneda").refine(val => val !== "Selecciona una moneda", { message: "Debe seleccionar una moneda válida" })
})

export type formSchemaRegistrarIngresoEgresoCajaType = z.infer<typeof schemaRegistrarIngresoEgresoCaja>;