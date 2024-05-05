import { Agencia } from "./Agencia";
import { Aval } from "./Aval";
import { Cliente } from "./Cliente";
import { Colonia } from "./Colonia";
import { Negocio } from "./Negocio";
import { SolicitudServicio } from "./Solicitud_Servicio";
import { Tarifa } from "./Tarifa";
import { Usuario } from "./Usuario";

export interface Solicitud{
    id:number;
    cliente: Cliente,
    aval: Aval,
    negocio: Negocio,
    agencia: Agencia,
    colonia: Colonia,
    cliente_id: number;
    tarifa_id: number;
    tarifa: Tarifa,
    creado_por_id: Usuario,
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    fecha_nacimiento: Date;
    sexo: string;
    curp: string;
    rfc: string;
    email: string;
    telefono: number;
    telefono_contacto1: number;
    telefono_contacto2: number;
    nombre_contacto1: string;
    nombre_contacto2: string;
    direccion_contacto1: string;
    direccion_contacto2: string;
    parentesco_contacto1: string;
    parentesco_contacto2: string;
    fecha_solicitud: Date;
    fecha_aprobacion: Date;
    calle: string;
    num_ext: string;
    num_int: string;
    colonia_id: number;
    municipio: string;
    localidad: string;
    estado: string;
    monto: number;
    tipo_identificacion_id: number;
    num_identificacion: string;
    vivienda: string;
    vivienda_otra: string;
    ocupacion_id: number;
    estatus_sol_id: number;
    estatus: string;
    num_dependientes: number;
    observaciones_negocio: string;
    tiempo_vivienda_años: number;
    tiempo_vivienda_meses: number;
    tiempo_empleo_años: number;
    tiempo_empleo_meses: number;
    sucursal_id: number;
    zona_id: number;
    agencia_id: number;
    sucursal: string;
    zona: string;
    tipo_empleo_id: number
    ingreso_mensual: number;
    periodicidad_ingresos: string;
    observaciones: string;
    niveles_casa: number;
    color_casa: string;
    color_porton: string;
    personas_viviendo: number;
    referencia: string;
    cruzamientos: string;
    //Servicios
    solicitudServicio: SolicitudServicio
    locked: number;
    tipo_solicitud_credito: number
}