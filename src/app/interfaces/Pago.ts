export interface Pago{
    id: number;
    num_contrato: number;
    cliente: String;
    folio: number;
    credito_id: number;
    monto: number;
    metodo_pago: string;
    weekyear: number;
    fecha: Date;
    hora: string;
    observaciones: string;
    cancelado: number;
}