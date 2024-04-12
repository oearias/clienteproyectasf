export interface Amortizacion{
    credito_id: number;
    num_semana: number;
    monto_semanal: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    suma_monto_pagado: number;
    remanente: number;
    penalizacion_semanal: number;
    dias_penalizacion: number;
    adeudo_semanal: number;
    expanded: boolean;
    pago_tardio: boolean;
}