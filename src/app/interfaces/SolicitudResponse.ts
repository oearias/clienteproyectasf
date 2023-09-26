import { Solicitud } from "./Solicitud";


export interface SolicitudResponse{
    totalPages: number,
    currentPage: number,
    solicitudesJSON: Solicitud[]
}