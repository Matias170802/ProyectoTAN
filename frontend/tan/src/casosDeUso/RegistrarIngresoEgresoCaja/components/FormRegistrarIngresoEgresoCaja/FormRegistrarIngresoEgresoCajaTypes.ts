export interface Props {
    title: string;
    description: string;
    onTransaccionAgregada?: (datosTransaccion: any) => void;
    modo: 'normal' | 'temporal';
}