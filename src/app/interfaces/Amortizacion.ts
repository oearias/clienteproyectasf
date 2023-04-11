export interface Amortizacion{
    credito_id: number;
    num_semanas: number;
    monto_semanal: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    suma_monto_pagado: number;
    penalizacion_semanal: number;
    adeudo_semanal: number;
    expanded: boolean;
}