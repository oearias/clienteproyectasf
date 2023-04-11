import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Credito } from 'src/app/interfaces/Credito';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { Tarifa } from 'src/app/interfaces/Tarifa';
import { CreditosService } from 'src/app/services/creditos.service';
import { FinanciamientosService } from 'src/app/services/financiamientos.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { TarifasService } from 'src/app/services/tarifas.service';
import { TipoContratoService } from 'src/app/services/tipo-contrato.service';
import { TipoCreditoService } from 'src/app/services/tipo-credito.service';
import { Amortizacion } from '../../../interfaces/Amortizacion';
import { BalanceService } from '../../../services/balance.service';
import { PagosService } from '../../../services/pagos.service';
import { Pago } from '../../../interfaces/Pago';
import { Subscription, forkJoin } from 'rxjs';
import { PathService } from '../../../services/path.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { TipoCredito } from '../../../interfaces/TipoCredito';
import { Financiamiento } from '../../../interfaces/Financiamiento';
import { TipoContrato } from 'src/app/interfaces/TipoContrato';
import { switchMap } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-credito-view',
  templateUrl: './credito-view.component.html',
  styleUrls: ['./credito-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in => out', animate('300ms ease-in')),
      transition('out => in', animate('300ms ease-out')),
    ]),
  ],
})
export class CreditoViewComponent implements OnInit {

  @ViewChild('fechaInicio') fecha_inicio_input: ElementRef;

  creditos: any[] = [];
  solicitudes: any[] = [];
  tarifas: any[] = [];
  financiamientos: any[] = [];
  tipoCreditos: any[] = [];
  tipoContratos: any[] = [];
  pagos: any[] = [];
  amortizacion: Amortizacion[] = [];
  amList = [];


  //TOTALES
  total_pagado: number = 0;
  total_penalizaciones: number = 0;
  grand_total: number = 0;
  //

  subscription: Subscription;
  subscription2: Subscription;

  creditoForm = this.fb.group({
    id: new FormControl(null),
    num_contrato: new FormControl(null),
    solicitud_credito_id: new FormControl(null, Validators.required),
    tipo_credito_id: new FormControl(null, Validators.required),
    tipo_contrato_id: new FormControl(null, Validators.required),
    fuente_financ_id: new FormControl(null, Validators.required),
    monto_otorgado: new FormControl(null, Validators.required),
    monto_total: new FormControl(null, Validators.required),
    monto_semanal: new FormControl(null),
    fecha_creacion: new FormControl(null),
    fecha_entrega_prog: new FormControl(null, Validators.required),
    fecha_inicio_prog: new FormControl(null, Validators.required),
    fecha_fin_prog: new FormControl(null, Validators.required),
    tarifa_id: new FormControl(null, Validators.required),
    cliente_id: new FormControl(null, Validators.required),
    renovacion: new FormControl(null),
    estatus_credito_id: new FormControl(null, Validators.required),
    locked: new FormControl(null),
    adeudo_restante: new FormControl(null),
    total_adeudo: new FormControl(null)
  });

  editingCredito: Credito;
  tarifaSelected: Tarifa;
  solicitudSelected: Solicitud;
  creditoSelected: Credito;

  isExpanded = false;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private balanceService: BalanceService,
    private creditoService: CreditosService,
    private pagoService: PagosService,
    private solService: SolicitudesService,
    private datePipe: DatePipe,
    private tarifaService: TarifasService,
    private financiamientoService: FinanciamientosService,
    private tipoCreditoService: TipoCreditoService,
    private tipoContratoService: TipoContratoService
  ) {

    //let year = new Date().getFullYear();

    this.creditoForm.setValue({
      id: null,
      num_contrato: null,
      solicitud_credito_id: null,
      tipo_credito_id: null,
      tipo_contrato_id: null,
      fuente_financ_id: null,
      fecha_entrega_prog: null,
      fecha_creacion: new Date(),
      fecha_inicio_prog: null,
      fecha_fin_prog: null,
      monto_otorgado: 0.00,
      monto_semanal: 0.00,
      monto_total: 0.00,
      tarifa_id: null,
      cliente_id: null,
      estatus_credito_id: 4,
      renovacion: null,
      locked: null,
      adeudo_restante: 0,
      total_adeudo: 0
    });

    this.creditoForm.disable();

    //preguntamos el role, y con esto habilitamos las fechas de entrega y fecha de inicio.
    //habilitamos por default las fechas para que puedan ser editadas, a esto hay que configurarle los roles
    this.fecha_inicio_prog.enable();
    this.fecha_entrega_prog.enable();



  }

  ngOnInit(): void {

    this.setPath();
    //this.loadData();

    this.route.params.subscribe((params) => {


      if (params.id) {

        forkJoin([
          this.tipoCreditoService.getTipoCreditos(),
          this.creditoService.getCreditos(),
          this.tarifaService.getTarifas(),
          this.financiamientoService.getFinanciamientos(),
          this.tipoContratoService.getTipoContratos(),
          this.creditoService.getCredito(params.id),
          this.creditoService.getAmortizacion(params.id)
        ]).subscribe((results: [TipoCredito[], Credito[], Tarifa[], Financiamiento[], TipoContrato[], Credito, Amortizacion[]]) => {

          this.creditos = results[1];
          this.editingCredito = results[5];

          this.tipoCreditos = results[0];
          this.tarifas = results[2];
          this.loadCreditoData(results[5]);

          this.grand_total = 0;
          this.total_pagado = 0;
          this.total_penalizaciones = 0;

          if(results[6]){

            this.amortizacion = results[6].map((item, i) => {

              item['expanded'] = false;
  
              this.total_pagado += Number(item.suma_monto_pagado);
              this.total_penalizaciones += Number(item.penalizacion_semanal);
              this.grand_total += Number(item.adeudo_semanal);
  
              return item;
  
            });

          }

          

        })

        // this.creditoService.getCredito(params.id).subscribe(res => {

        //   this.editingCredito = res;

        //   this.id?.setValue(this.editingCredito.id);
        //   this.num_contrato?.setValue(this.editingCredito.num_contrato);

        //   this.solicitud_credito_id?.setValue(this.editingCredito.id);

        //   this.cliente_id?.setValue(this.editingCredito.cliente_id);
        //   this.tarifa_id?.setValue(this.editingCredito.tarifa_id);
        //   this.monto_otorgado?.setValue(this.editingCredito.monto_otorgado);
        //   this.monto_total?.setValue(this.editingCredito.monto_total);
        //   this.monto_semanal?.setValue(this.editingCredito.monto_semanal);

        //   //preguntamos si hay fecha_inicio_prog, fecha_fin_prog y fecha_entrega
        //   console.log(this.editingCredito.fecha_inicio_prog);
        //   console.log(this.editingCredito.fecha_entrega_prog);
        //   console.log(this.editingCredito.fecha_fin_prog);

        //   (this.editingCredito.fecha_inicio_prog) ? this.fecha_inicio_prog.setValue(this.datePipe.transform(this.editingCredito.fecha_inicio_prog, 'yyyy-MM-dd', '0+100')) : null;
        //   (this.editingCredito.fecha_fin_prog) ? this.fecha_fin_prog.setValue(this.datePipe.transform(this.editingCredito.fecha_fin_prog, 'yyyy-MM-dd', '0+100')) : null;
        //   (this.editingCredito.fecha_entrega_prog) ? this.fecha_entrega_prog.setValue(this.datePipe.transform(this.editingCredito.fecha_entrega_prog, 'yyyy-MM-dd', '0+100')) : null;

        //   if (this.editingCredito.entregado === 1) {
        //     this.tipo_credito_id.setValue(this.editingCredito.tipo_credito_id);
        //     this.renovacion.setValue(this.editingCredito.renovacion);
        //   } else {
        //     this.tipo_credito_id.setValue('-');
        //     this.renovacion.setValue(null)
        //   }

        //   this.fuente_financ_id?.setValue(this.editingCredito.fuente_financ_id);
        //   this.tipo_contrato_id?.setValue(this.editingCredito.tipo_contrato_id);

        //   //Obtenemos los datos de la tarifa
        //   this.tarifaService.getTarifa(this.tarifa_id.value).subscribe(tarifa => {

        //     this.tarifaSelected = tarifa;

        //   });

        //   //preguntamos el role, y con esto habilitamos las fechas de entrega y fecha de inicio.
        //   if (this.editingCredito?.locked === 1) {
        //     this.fecha_inicio_prog.disable();
        //     this.fecha_entrega_prog.disable();
        //   }



        //   //this.getSolicitudesException(this.solicitud_credito_id.value);
        //   this.getCreditosException(this.editingCredito.solicitud_credito_id)

        //   //Calculamos el balance
        //   //***this.getBalance(this.editingCredito);
        //   //this.getPagos(this.editingCredito);

        //   this.getAmortizacion();

        //   ///
        //   // this.subscription = this.pagoService.refresh$.subscribe(() => {
        //   //   this.getPagos(this.editingCredito);
        //   // });
        //   ////


        // });


      }
    });
  }

  loadData() {

    // forkJoin([
    //   this.tipoCreditoService.getTipoCreditos(),
    //   this.creditoService.getCreditos(),
    //   this.tarifaService.getTarifas(),
    //   this.financiamientoService.getFinanciamientos(),
    //   this.tipoContratoService.getTipoContratos(),
    //   //this.creditoService.getAmortizacion()
    // ]).subscribe((results: [TipoCredito[], Credito[], Tarifa[], Financiamiento[], TipoContrato[]]) => {

    //   this.creditos = results[1].filter(item => item.preaprobado === 1)
    //     .map((credito) => {
    //       credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
    //       return credito;
    //     });

    //   this.route.params.pipe(
    //     switchMap(params => this.creditoService.getCredito(params.id))
    //   ).subscribe(credito => {
    //     console.log('lo estas logrando');
    //     this.creditoService.getAmortizacion(credito).subscribe(amorti => {
    //       this.amortizacion = amorti.map(item => {

    //         item['expanded'] = false;

    //         this.total_pagado += Number(item.suma_monto_pagado);
    //         this.total_penalizaciones += Number(item.penalizacion_semanal);
    //         this.grand_total += Number(item.adeudo_semanal);

    //         return item;

    //       });
    //     })
    //   })

    // })

    // this.getSolicitudes(); se elimina por que ya las solicitudes en teoría fueron convertidas a creditos
    // this.getCreditos();
    // this.getTarifas();
    // this.getFinanciamientos()
    // this.getTipoCreditos();
    // this.getTipoContratos();

  }

  // getSolicitudes() {

  //   this.solService.getSolicitudes().subscribe(solicitudes => {

  //     this.solicitudes = solicitudes
  //       .filter(item => item.estatus_sol_id === 7)
  //       .filter(item => item.locked != 1)
  //       .map((sol) => {
  //         sol.nombre = `${sol.id} | ${sol.nombre} ${sol.apellido_paterno} ${sol.apellido_materno}`
  //         return sol;
  //       });

  //   })
  // }

  // getSolicitudesException(id: number) {

  //   this.solService.getSolicitudesException(id).subscribe(solicitudes => {

  //     this.solicitudes = solicitudes
  //       .filter(item => item.estatus_sol_id === 7 || item.id === id)
  //       //.filter(item => item.locked != 1)
  //       .map((sol) => {
  //         sol.nombre = `${sol.id} | ${sol.nombre} ${sol.apellido_paterno} ${sol.apellido_materno}`
  //         return sol;
  //       });

  //   })
  // }


  loadCreditoData(credito: Credito) {

    this.id?.setValue(credito.id);
    this.num_contrato?.setValue(credito.num_contrato);

    this.solicitud_credito_id?.setValue(credito.id);

    this.cliente_id?.setValue(credito.cliente_id);
    this.tarifa_id?.setValue(credito.tarifa_id);
    this.monto_otorgado?.setValue(credito.monto_otorgado);
    this.monto_total?.setValue(credito.monto_total);
    this.monto_semanal?.setValue(credito.monto_semanal);


    (credito.fecha_inicio_prog) ? this.fecha_inicio_prog.setValue(this.datePipe.transform(credito.fecha_inicio_prog, 'yyyy-MM-dd', '0+100')) : null;
    (credito.fecha_fin_prog) ? this.fecha_fin_prog.setValue(this.datePipe.transform(credito.fecha_fin_prog, 'yyyy-MM-dd', '0+100')) : null;
    (credito.fecha_entrega_prog) ? this.fecha_entrega_prog.setValue(this.datePipe.transform(credito.fecha_entrega_prog, 'yyyy-MM-dd', '0+100')) : null;

    if (credito.entregado === 1) {
      this.tipo_credito_id.setValue(credito.tipo_credito_id);
      this.renovacion.setValue(credito.renovacion);
    } else {
      this.tipo_credito_id.setValue('-');
      this.renovacion.setValue(null)
    }

    this.fuente_financ_id?.setValue(credito.fuente_financ_id);
    this.tipo_contrato_id?.setValue(credito.tipo_contrato_id);

    //Obtenemos los datos de la tarifa
    // this.tarifaService.getTarifa(this.tarifa_id.value).subscribe(tarifa => {

    //   this.tarifaSelected = tarifa;

    // });


    //preguntamos el role, y con esto habilitamos las fechas de entrega y fecha de inicio.
    if (credito?.locked === 1) {
      this.fecha_inicio_prog.disable();
      this.fecha_entrega_prog.disable();
    }

    //this.getSolicitudesException(this.solicitud_credito_id.value);
    this.getCreditosException(credito.solicitud_credito_id)

    //Calculamos el balance
    //***this.getBalance(this.editingCredito);
    //this.getPagos(this.editingCredito);

    //this.getAmortizacion();

    ///
    // this.subscription = this.pagoService.refresh$.subscribe(() => {
    //   this.getPagos(this.editingCredito);
    // });
    ////

  }

  // getCreditos() {
  //   this.creditoService.getCreditos().subscribe(creditos => {

  //     this.creditos = creditos
  //       .filter(item => item.preaprobado === 1)
  //       .map((credito) => {
  //         credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
  //         return credito;
  //       });

  //   });
  // }

  getCreditosException(id: number) {

      this.creditos
        .filter(item => item.preaprobado === 1 || item.solicitud_credito_id === id)
        .map((credito) => {
          credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
          return credito;
        });


  }

  // getAmortizacion() {

  //   this.grand_total = 0;
  //   this.total_pagado = 0;
  //   this.total_penalizaciones = 0;

  //   this.creditoService.getAmortizacion(this.editingCredito).subscribe(res => {

  //     this.amortizacion = res.map(item => {

  //       console.log(res);

  //       item['expanded'] = false;

  //       this.total_pagado += Number(item.suma_monto_pagado);
  //       this.total_penalizaciones += Number(item.penalizacion_semanal);
  //       this.grand_total += Number(item.adeudo_semanal);

  //       return item;

  //     });

  //   });


  // }

  colapsa(amorti: any, indice: number) {

    //amorti.expanded = !amorti.expanded;
    // console.log(indice);

    this.amortizacion[indice].expanded = !this.amortizacion[indice].expanded;
  }

  onChangeTarifa(event: any) {

    //Cada que se cambie la tarifa se tiene que resetear las fechas
    this.tarifaService.getTarifa(event.id).subscribe(tarifa => {

      this.tarifaSelected = tarifa;

      let calculo = Number(this.creditoSelected?.monto_otorgado) + Number(this.creditoSelected?.monto_otorgado * tarifa.cociente);

      this.monto_total?.setValue((Number(calculo).toFixed(2)));

    });

    this.limpiarFechas();

  }

  onChangeSolicitud(event: any) {

    if (event) {


      //this.solicitudSelected = this.solicitudes.filter(sol => sol.id === event.id) as unknown as Solicitud;
      //this.solicitudSelected = this.solicitudSelected[0];

      this.creditoSelected = this.creditos.filter(credito => credito.id === event.id) as unknown as Credito;
      this.creditoSelected = this.creditoSelected[0];

      //this.populateCreditoFields(this.solicitudSelected);
      this.populateCreditoFields(this.creditoSelected);


      //Aqui hacemos un onchange tarifa

      const Event = {
        id: this.solicitudSelected?.tarifa_id
      }

      this.onChangeTarifa(Event)


    }
  }

  onChangeFechaInicio() {

    //preguntamos de cuanto es la tarifa
    if (this.tarifaSelected?.num_semanas) {

      //Tenemos que validar que sea en un martes el día de fecha_inicio
      let fecha_inicio = this.fecha_inicio_input.nativeElement.value;
      let esMartes = this.detectWhatDayIs(fecha_inicio);

      if (esMartes === 1) {

        let num_dias = (this.tarifaSelected?.num_semanas * 7);
        let fecha_aux = new Date(fecha_inicio).toISOString();
        this.fecha_fin_prog.setValue(this.datePipe.transform(this.sumarDias(fecha_aux, num_dias)));

      } else {

        Swal.fire({
          title: 'Fecha de inicio no válida',
          html: `La fecha de inicio del crédito tiene que ser día martes obligatoriamente`,
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#2f5ade',
          confirmButtonText: '¡Entendido!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.fecha_inicio_prog.setValue(null);
            this.fecha_fin_prog.setValue(null);
          }
        });


      }

    } else {

      console.log('no hay num de semanas');
      //si nohay num de semanas bloqueamos la fecha de inicio
    }

  }

  detectWhatDayIs(fecha: any) {

    let whatday = new Date(fecha);

    return whatday.getDay();
  }

  limpiarFechas() {
    this.fecha_inicio_prog.setValue(null);
    this.fecha_fin_prog.setValue(null);
  }

  sumarDias(fecha: any, dias: number) {

    //Este le suma 1 día
    //dias = dias + 1;

    let fecha_aux = new Date(fecha)
    let a = fecha_aux.setDate(fecha_aux.getDate() + dias);
    let fecha_fin = new Date(a);

    return fecha_fin;
  }

  populateCreditoFields(data: Credito) {

    this.tarifa_id?.setValue(data.tarifa_id);
    this.monto_otorgado?.setValue(data.monto_otorgado);
    this.cliente_id?.setValue(data.cliente_id);

  }

  lockCredito() {

    Swal.fire({
      title: 'Entrega de contrato',
      html: `¿Está ud. seguro que desea marcar el credito: <br><b>${this.num_contrato.value}</b>, como entregado?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        this.updateCredito();

      }
    });
  }

  checkEntregado() {

    //Actualizamos la fecha de entrega, fechas de inicio y fin y bloqueamos...
    this.lockCredito();

  }

  // getPagos(credito: Credito) {

  //   let suma = 0;

  //   this.pagoService.getPagosByCreditoId(credito.id).subscribe(pagos => {

  //     pagos.forEach(item => {
  //       suma = suma + Number(item.monto);
  //     })

  //     this.total_pagado?.setValue(this.formatNumberWithCommas((suma).toFixed(2)));
  //     this.pagos = pagos;

  //   });

  // }

  getBalance(credito: Credito) {

    this.balanceService.getAdeudo(credito.id).subscribe(res => {

      if (res.adeudo_restante2 == '.00') {
        res.adeudo_restante2 = '0.00'
      }

      if (!res.total_recargos2 || res.total_recargos2 == '.00') {
        res.total_recargos2 = '0.00'
      }

      if (!res.grand_total2 || res.grand_total2 == '.00') {
        res.grand_total2 = '0.00'
      }

      this.adeudo_restante?.setValue(res.adeudo_restante2);
      //this.total_recargos?.setValue(res.total_recargos2);
      this.total_adeudo?.setValue(res.grand_total2);

      //let grand_total = Number(res.total_recargos) + Number(res.adeudo_restante)
      //this.total_adeudo?.setValue( grand_total.toFixed(2));


    });
  }

  updateCredito() {

    this.locked.setValue(1);

    this.creditoService.updateCredito(this.creditoForm.getRawValue()).subscribe((res: any) => {

      this.toastr.success(res);

      //this.router.navigateByUrl('/dashboard/creditos/credito/view/'+this.editingCredito.id);
      this.ngOnInit();
    })
  }

  formatNumberWithCommas(cadena: string) {
    return cadena.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  volver() {
    this.router.navigate(['/dashboard/creditos']);
  }

  setPath() {
    this.pathService.path = '/dashboard/creditos';
  }

  confirmDeletePago(pago: Pago) {

    Swal.fire({
      title: 'Eliminar Pago',
      html: `¿Está ud. seguro que desea eliminar el pago <b>${pago?.folio}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {


        this.pagoService.deletePago(pago).subscribe();

        this.getBalance(this.editingCredito);

        this.subscription2 = this.balanceService.refresh$.subscribe(() => {
          this.getBalance(this.editingCredito);
        });

      }
    });
  }

  printAllDocumentation() {
    this.creditoService.downloadAllDocumentation(this.editingCredito);
  }

  printContrato() {
    this.creditoService.downloadContrato(this.editingCredito);
  }

  printAmortizacion() {
    this.creditoService.downloadAmortizacion(this.editingCredito);
  }

  printTarjetaPagos() {
    this.creditoService.downloadTarjetaPagos(this.editingCredito);
  }



  //Getters
  get id() {
    return this.creditoForm.get('id');
  }

  get solicitud_credito_id() {
    return this.creditoForm.get('solicitud_credito_id');
  }

  get tipo_credito_id() {
    return this.creditoForm.get('tipo_credito_id');
  }

  get tarifa_id() {
    return this.creditoForm.get('tarifa_id');
  }

  get cliente_id() {
    return this.creditoForm.get('cliente_id');
  }

  get num_contrato() {
    return this.creditoForm.get('num_contrato');
  }

  get monto_otorgado() {
    return this.creditoForm.get('monto_otorgado');
  }

  get monto_total() {
    return this.creditoForm.get('monto_total');
  }

  get monto_semanal() {
    return this.creditoForm.get('monto_semanal');
  }

  get fecha_creacion() {
    return this.creditoForm.get('fecha_creacion');
  }

  get fecha_inicio_prog() {
    return this.creditoForm.get('fecha_inicio_prog');
  }

  get fecha_fin_prog() {
    return this.creditoForm.get('fecha_fin_prog');
  }

  get fecha_entrega_prog() {
    return this.creditoForm.get('fecha_entrega_prog');
  }

  get renovacion() {
    return this.creditoForm.get('renovacion');
  }

  get fuente_financ_id() {
    return this.creditoForm.get('fuente_financ_id');
  }

  get tipo_contrato_id() {
    return this.creditoForm.get('tipo_contrato_id');
  }

  get locked() {
    return this.creditoForm.get('locked');
  }

  get adeudo_restante() {
    //Adeudo sin recargos
    return this.creditoForm.get('adeudo_restante');
  }

  // get total_recargos() {
  //   return this.creditoForm.get('total_recargos');
  // }

  // get total_pagado() {
  //   return this.creditoForm.get('total_pagado');
  // }

  get total_adeudo() {
    return this.creditoForm.get('total_adeudo');
  }

}
