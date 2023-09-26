import { Pago } from "./Pago";

export interface PagoResponse{
    totalPages: number,
    currentPage: number,
    pagosJSON: Pago[]
}