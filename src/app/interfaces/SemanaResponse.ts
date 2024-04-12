import { Semana } from "./Semana";

export interface SemanaResponse{
    totalPages: number,
    currentPage: number,
    semanasJSON: Semana[]
}