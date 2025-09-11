import {z} from "zod";

export const schemaRegistrarCotizacionMoneda = z.object({
    moneda: z.string().min(1, "Debe seleccionar una moneda"),
    montoCompra: z.number().min(0.01, "El monto de compra debe ser mayor a 0").max(10000, "El monto de compra no puede ser mayor a 10.000"),
    montoVenta: z.number().min(0.01, "El monto de venta debe ser mayor a 0").max(10000, "El monto de venta no puede ser mayor a 10.000"),
})

export type formSchemaRegistrarCotizacionMonedaType = z.infer<typeof schemaRegistrarCotizacionMoneda>;