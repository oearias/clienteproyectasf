export interface Tarifa{
    id: number;
    nombre: string;
    monto: number;
    monto_semanal: number;
    num_semanas: number;
    cociente: number;
    estatus: string;
    bonificaciones: boolean;
}