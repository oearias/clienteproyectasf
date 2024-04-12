import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CreditosService } from '../../services/creditos.service';
import { PagosService } from '../../services/pagos.service';
import { Cliente } from 'src/app/interfaces/Cliente';
import { forkJoin } from 'rxjs';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { Credito } from 'src/app/interfaces/Credito';
import { Pago } from 'src/app/interfaces/Pago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  role: any;
  modulos_permitidos: any[];
  submodulos_permitidos: any[] = [];
  allowedRoles = ['CREATOR', 'ADMIN'];

  //Aqui debemos de obtener los permisos y mostrar las casillas

  fechaHoy: Date = new Date();

  creditos: Credito[] = [];

  solicitudes: Solicitud[] = [];
  solicitudesRevisar: Solicitud[] = [];
  solicitudesPresupuesto: Solicitud[] = [];

  creditosProgEntrega: Credito[] = [];

  pagos: Pago[] = [];
  pagosHoy: Pago[] = [];
  pagosLastWeek: Pago[] = []

  total_clientes: number = 0;
  total_clientes2: number;

  total_solicitudes: number = 0;
  total_solicitudes2: number;

  total_solicitudes_revisar: number = 0;
  total_solicitudes_revisar2: number;

  total_solicitudes_presup: number = 0;
  total_solicitudes_presup2: number;

  total_creditos: number = 0;
  total_creditos2: number;

  total_solicitudes_aprobadas_entrega: number = 0;
  total_solicitudes_rechazadas: number = 0;
  total_creditos_entregados: number = 0
  total_creditos_no_entregados: number = 0

  total_creditos_prog_entrega: number = 0;
  total_creditos_prog_entrega2: number;
  total_creditos_marcar_entrega: number = 0;

  total_pagos: number = 0;
  total_pagos2: number;

  total_pagos_hoy: number = 0;
  total_pagos_lastweek: number = 0;

  constructor(
    private router: Router,
    private clienteService: ClientesService,
    private solicitudService: SolicitudesService,
    private creditoService: CreditosService,
    private pagoService: PagosService,
    private datePipe: DatePipe
  ) {
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {

    if (!sessionStorage.getItem('token')) {
      console.log('Bye Bye Bye');
      this.router.navigate(['/login']);
    }

    const arreglo = localStorage.getItem('modulos');
    this.modulos_permitidos = JSON.parse(arreglo);

    this.modulos_permitidos.forEach( modulos =>{
      
      modulos.submenu.forEach(item=>{

        this.submodulos_permitidos.push(item.titulo);
      })

    });

    console.log(this.submodulos_permitidos);



    this.getTotales();

  }

  getTotales() {

    // forkJoin([
    //   this.clienteService.getClientesTotal(),
    //   this.solicitudService.getSolicitudesTotales(),
    //   this.creditoService.getCreditosTotales(),
    //   this.pagoService.getPagos()
    // ]).subscribe((results: [number, any, any, Pago[]]) => {


    //   const fechaHoy = new Date();
    //   const fechaLastWeek = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate() - 6);
    //   const fechaHoyFormateada = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');
    //   const fechaLastWeekFormateada = this.datePipe.transform(fechaLastWeek, 'yyyy-MM-dd');


    //   if (this.role === 'EDITOR' || this.role === 'ADMIN') {
    //     //Solicitudes por revisar
    //     this.total_solicitudes_revisar = results[1].total_solicitudes_revisar;

    //   }

    //   this.total_solicitudes_presup = results[1].total_solicitudes_presupuesto;

    //   this.total_solicitudes = results[1].total_solicitudes;

      

    //   this.total_solicitudes_rechazadas = results[1].total_solicitudes_rechazadas;

    //   this.total_solicitudes_aprobadas_entrega = results[1].total_solicitudes_aprobadas;


    //   this.total_creditos = results[2].total_creditos;
    //   this.total_creditos_prog_entrega = results[2].total_creditos_prog_entrega;
    //   this.total_creditos_marcar_entrega = results[2].total_creditos_marcar_entrega;
    //   this.total_creditos_entregados = results[2].total_creditos_entregados;
    //   this.total_creditos_no_entregados = results[2].total_creditos_no_entregados;

    //   this.pagos = results[3]
    //     .map((pago: any) => {
    //       pago.fecha = this.datePipe.transform(pago.fecha, 'yyyy-MM-dd', '0+100')
    //       return pago;
    //     })
    //     .filter(item => item.cancelado != 1);


    //   this.pagosLastWeek = this.pagos
    //     .filter(item => item.cancelado != 1)
    //     .filter(item =>
    //     (
    //       //El new date evita que se tenga que pasar por un map el pago.fecha para poder comparar como string
    //       new Date(item.fecha).toISOString().slice(0, 10) >= fechaLastWeekFormateada &&
    //       new Date(item.fecha).toISOString().slice(0, 10) <= fechaHoyFormateada
    //     ));

    //   this.pagosHoy = this.pagos
    //     .filter(item => item.cancelado != 1)
    //     .filter(item => (new Date(item.fecha).toISOString().slice(0, 10) === fechaHoyFormateada));


    //   this.total_clientes = results[0];
    //   this.total_clientes2 = results[0];


    //   this.total_solicitudes2 = this.total_solicitudes;
    //   this.total_solicitudes_revisar2 = this.total_solicitudes_revisar;
    //   this.total_solicitudes_presup2 = this.total_solicitudes_presup;

    //   this.total_creditos2 = this.total_creditos;


    //   this.total_creditos_prog_entrega2 = this.total_creditos_prog_entrega;


    //   this.total_pagos = this.pagos.length;
    //   this.total_pagos2 = this.pagos.length;
    //   this.total_pagos_hoy = this.pagosHoy.length;

    //   this.total_pagos_lastweek = this.pagosLastWeek.length;

    //   this.animarConteoClientes(this.total_clientes);
    //   this.animarConteoSolicitudes(this.total_solicitudes);
    //   this.animarConteoSolicitudesRevision(this.total_solicitudes_revisar);
    //   this.animarConteoSolicitudesPresupuesto(this.total_solicitudes_presup);
    //   this.animarConteoCreditos(this.total_creditos);
    //   this.animarConteoCreditosProgEntrega(this.total_creditos_prog_entrega);
    //   this.animarConteoPagos(this.total_pagos);

    // });


  }

  animarConteoClientes(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_clientes = auxiliar;
        auxiliar = auxiliar + 20;
      } else {
        this.total_clientes = this.total_clientes2;
        clearInterval(interval);
      }
    }, 1)
  }

  animarConteoSolicitudes(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_solicitudes = auxiliar;
        auxiliar = auxiliar + 100;
      } else {
        this.total_solicitudes = this.total_solicitudes2;
        clearInterval(interval);
      }
    }, 1)
  }

  animarConteoSolicitudesRevision(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_solicitudes_revisar = auxiliar;
        auxiliar = auxiliar + 1;
      } else {
        this.total_solicitudes_revisar = this.total_solicitudes_revisar2;
        clearInterval(interval);
      }
    }, 30)
  }

  animarConteoSolicitudesPresupuesto(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_solicitudes_presup = auxiliar;
        auxiliar = auxiliar + 1;
      } else {
        this.total_solicitudes_presup = this.total_solicitudes_presup2;
        clearInterval(interval);
      }
    }, 30)
  }

  animarConteoCreditos(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_creditos = auxiliar;
        auxiliar = auxiliar + 100;
      } else {
        this.total_creditos = this.total_creditos2;
        clearInterval(interval);
      }
    }, 1)
  }

  animarConteoCreditosProgEntrega(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_creditos_prog_entrega = auxiliar;
        auxiliar = auxiliar + 200;
      } else {
        this.total_creditos_prog_entrega = this.total_creditos_prog_entrega2;
        clearInterval(interval);
      }
    }, 30)
  }

  animarConteoPagos(total: number) {

    let auxiliar = 0;

    const interval = setInterval(() => {
      if (auxiliar <= total) {
        this.total_pagos = auxiliar;
        auxiliar = auxiliar + 20000;
      } else {
        this.total_pagos = this.total_pagos2;
        clearInterval(interval);
      }
    }, 30)
  }

}
