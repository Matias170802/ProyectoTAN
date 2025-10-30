import { useFetch } from "@/generalHooks/useFetch";

export interface ReservaDTO {
  codReserva: string;
  fechaHoraCheckin: string;
  fechaHoraCheckout: string;
  fechaHoraAltaReserva: string;
  totalDias: number;
  cantHuespedes: number;
  totalMonto: number;
  totalMontoSenia: number;
  plataformaOrigen: string;
  codInmueble: string;
  nombreInmueble: string;
  codEstadoReserva: string;
  nombreEstadoReserva: string;
}

export const useReservas = () => {
  // Endpoint del backend
  const url = "/api/reservas/reservas";
  // Usamos el hook general para traer los datos
  const { data, loading, error } = useFetch<ReservaDTO[]>(url);
  return { reservas: data, loading, error };
};
