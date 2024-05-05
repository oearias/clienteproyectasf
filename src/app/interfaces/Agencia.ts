import { Zona } from "./Zona";

export interface Agencia {
    id: number;
    nombre: string;
    zona_id: number;
    zona: Zona;
}