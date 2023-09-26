import { Cliente } from "./Cliente";

export interface ClienteResponse{
    totalPages: number,
    currentPage: number,
    clientesJSON: Cliente[]
}