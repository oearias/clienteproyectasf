import { Cliente } from './Cliente';
import { Solicitud } from './Solicitud';
import { Tarifa } from './Tarifa';
import { TipoContrato } from './TipoContrato';
import { TipoCredito } from './TipoCredito';

export interface Credito {
    id: number;
    num_contrato: number;
    num_contrato_historico: string;
    monto_otorgado: number;
    monto_total: number;
    monto_semanal: number;
    fecha_creacion: Date;
    fecha_inicio_prog: Date;
    fecha_inicio_real: Date;
    fecha_entrega_prog: Date;
    fecha_entrega_real: Date;
    fecha_fin_prog: Date;
    fecha_fin_prog_proyecta: Date;
    hora_entrega: Date;
    tarifa_id: number;
    tarifa: Tarifa;
    año: number;
    nombre: string;
    motivo: string;
    cliente: Cliente;
    cliente_id: number;
    num_cliente: string;
    apellido_paterno: string;
    apellido_materno: string;
    solicitud_credito_id: number;
    solicitudCredito: Solicitud,
    tipo_credito_id: number;
    tipoCredito: TipoCredito,
    tipo_contrato_id: number;
    estatus_contrato_id:number;
    estatus_credito_id: number;
    agencia: number;
    zona: number;
    fuente_financ_id:number;
    locked: number;
    renovacion:number;
    preaprobado:number;
    num_cheque:number;
    entregado: number;
    no_entregado: number;
    inversion_positiva: boolean;
    dias_penalizaciones: number;
    aux_num_penalizaciones: number;
}