import {z} from "zod";

export const schemaRegistrarCambioMoneda = z.object({
    tipoCambio: z.string().min(1, "Debe seleccionar un tipo de cambio").refine(val => val !== "seleccioneUnTipoDeCambio", { message: "Debe seleccionar un tipo de cambio válido" }),
    montoAConvertir: z.coerce.number()
        .refine(val => !isNaN(val), "Debe ingresar un número válido")
        .refine(val => val > 0, "El monto a convertir debe ser mayor a 0")
        .refine(val => val <= 10000000, "El monto a convertir no puede ser mayor a 10000000")
})

export type formSchemaRegistrarCambioMonedaType = z.infer<typeof schemaRegistrarCambioMoneda>;
