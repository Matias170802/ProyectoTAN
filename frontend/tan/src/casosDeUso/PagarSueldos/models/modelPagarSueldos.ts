import {z} from "zod";

export const schemaPagarSueldos = z.object({
    dniEmpleado: z.string().min(1, "Debe seleccionar un empleado").refine(val => val !== "SeleccioneUnEmpleado", { message: "Debe seleccionar un empleado válido" }),
})

export type formSchemaPagarSueldosType = z.infer<typeof schemaPagarSueldos>;
