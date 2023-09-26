import { Credito } from "./Credito";


export interface CreditoResponse{
    totalPages: number,
    currentPage: number,
    creditosJSON: Credito[]
}