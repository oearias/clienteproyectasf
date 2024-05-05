import { Agencia } from "./Agencia";
import { Colonia } from "./Colonia";

export interface Cliente {
    id: number;
    sucursal_id: number;
    zona_id: number;
    zona: string;
    agencia_id: number;
    agencia: Agencia;
    num_cliente: number;
    num_cliente2: string;
    nombre_completo: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    telefono: string;
    curp: string;
    rfc: string;
    email: string;
    sexo: string;
    tipo_cliente: string;
    calle: string;
    colonia_id: number;
    cp: number;
    num_ext: string;
    num_int: string;
    cruzamientos: string;
    referencia: string;
    municipio: string;
    localidad: string;
    estado: string;
    num_creditos: number;
    colonia: Colonia
}