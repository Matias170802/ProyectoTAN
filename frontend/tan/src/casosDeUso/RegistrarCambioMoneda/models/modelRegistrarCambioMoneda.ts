import {z} from "zod";

export const schemaRegistrarCambioMoneda = z.object({
    tipoCambio: z.string().refine(value => value !== "seleccioneUnTipoDeCambio", {
        message: "Debe seleccionar un tipo de cambio"
    }),
    montoAConvertir: z.coerce
        .number({
            required_error: "El monto es requerido",
            invalid_type_error: "Debe ser un número válido"
        })
        .positive("El monto debe ser mayor a 0")
}).refine((data) => {
    // Esta validación se ejecutará en el componente cuando tengamos acceso a cajaMadre
    // Por ahora solo retornamos true ya que la validación real se hace en el componente
    return true;
}, {
    message: "Validación personalizada",
    path: ["montoAConvertir"]
});

export type formSchemaRegistrarCambioMonedaType = z.infer<typeof schemaRegistrarCambioMoneda>;
