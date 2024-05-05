
import { Colonia } from "./Colonia";

export interface Negocio {
    id: number;
    nombre: string;
    giro: string;
    telefono: string;
    calle: string;
    num_ext: string;
    colonia: Colonia;
    hora_pago: Date;
}