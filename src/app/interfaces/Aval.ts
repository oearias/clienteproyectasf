import { Agencia } from "./Agencia";
import { Colonia } from "./Colonia";

export interface Aval {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    telefono: string;
    calle: string;
    num_ext: string;
    colonia: Colonia;
}