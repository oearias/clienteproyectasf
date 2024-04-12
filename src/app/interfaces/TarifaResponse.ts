import { Tarifa } from './Tarifa';

export interface TarifaResponse{
    totalPages: number,
    currentPage: number,
    tarifasJSON: Tarifa[]
}