import { TipoAsentamiento } from "./TipoAsentamiento";

export interface Colonia{
    id: number;
    nombre: string;
    tipo_asentamiento_id: number;
    cp: number;
    tipoAsentamiento: TipoAsentamiento
}