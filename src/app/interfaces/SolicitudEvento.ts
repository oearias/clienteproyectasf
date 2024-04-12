import { Usuario } from "./Usuario";

export interface SolicitudEvento{
    solicitud_credito_id: number;
    oservacion: string;
    usuario: Usuario;
    fecha: Date
}