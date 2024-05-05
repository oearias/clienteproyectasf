import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TipoCredito } from '../../../interfaces/TipoCredito';

import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';

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
  tarifas: Tarifa[] = [];
  tarifa: Tarifa;
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
  total_tarifas_semanales: number = 0;
  total_penalizaciones_israel: number = 0;
  total_dias_penalizaciones: number = 0;
  total_remanente: number = 0;
  //

  subscription: Subscription;
  subscription2: Subscription;

  creditoForm = this.fb.group({
    id: new FormControl(null),
    num_contrato: new FormControl(null),
    num_contrato_historico: new FormControl(null),
    nombre: new FormControl(null),
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

  resultadoForkJoin: any;

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
    private customCurrencyPipe: CustomCurrencyPipe,
    private currencyPipe: CurrencyPipe,
    private tarifaService: TarifasService,
    private financiamientoService: FinanciamientosService,
    private tipoCreditoService: TipoCreditoService,
    private tipoContratoService: TipoContratoService,
    private cdr: ChangeDetectorRef
  ) {

    //let year = new Date().getFullYear();

    this.creditoForm.setValue({
      id: null,
      num_contrato: null,
      num_contrato_historico: null,
      nombre: null,
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

          //this.creditoService.getCreditos(),
          //this.tarifaService.getTarifas(),
          //this.creditoService.getCredito(params.id),
          this.creditoService.getAmortizacion(params.id),
          this.creditoService.getCreditoOptimizado(params.id),
          this.tarifaService.getTarifas(),
          this.tipoCreditoService.getTipoCreditos()

        ]).subscribe(
          (results:
            [
              //Credito[],
              //Tarifa[],
              //Credito, 
              Amortizacion[],
              Credito,
              Tarifa[],
              TipoCredito[]
            ]) => {

              //console.log(results[1]);


            //this.creditos = results[0];
            //this.editingCredito = results[1];

            //this.tarifas = results[0];
            this.tarifas = results[2];
            this.tipoCreditos = results[3];

            //this.loadCreditoData(results[1]);

            this.grand_total = 0;
            this.total_pagado = 0;
            this.total_penalizaciones = 0;


            if (results[0]) {

              this.amortizacion = results[0].map((item) => {

                console.log('Num de Semana: ', item.num_semana);
                console.log('Dias de penalizacion: ', item.dias_penalizacion);


                this.total_remanente += Number(item.remanente);

                

                item['expanded'] = false;


                this.total_pagado += Number(item.suma_monto_pagado);

                if(item.dias_penalizacion > 0 ){

                  console.log('hay penalizacion');

                  //Preguntamos si existe remanente
                  if( item.remanente >= item.monto_semanal ){


                    //this.total_dias_penalizaciones = 0;
                    //item.dias_penalizacion = 0;
                    //item.penalizacion_semanal = 0;

                    item.suma_monto_pagado = Number(item.suma_monto_pagado) + Number(item.remanente);


                  }


                }else{
                  item.dias_penalizacion = 0;
                }

                //Preguntamos si es pago tardío
                if(item.pago_tardio){

                  console.log('Hay pago tardío');

                  item.adeudo_semanal = Number(0) - Number(item.suma_monto_pagado);

                }else{

                  item.adeudo_semanal = ( Number(item.monto_semanal) - Number(item.suma_monto_pagado) )  + Number(item.penalizacion_semanal)
                }


                // console.log('//////////////////////');
                // console.log('Num semana', item.num_semana);
                // console.log('Monto semanal', item.monto_semanal);
                // console.log('Adeudo semanal',item.adeudo_semanal);
                // console.log('Suma pagado:',item.suma_monto_pagado);
                // console.log('Remanente', item.remanente);

                
                
                this.grand_total += Number(item.adeudo_semanal);

                if (item.monto_semanal > 0) {

                  this.total_tarifas_semanales += Number(item.monto_semanal);
                }


                item.adeudo_semanal = ( Number(item.monto_semanal) - Number(item.suma_monto_pagado) ) + Number(item.penalizacion_semanal  )
                this.total_dias_penalizaciones += item.dias_penalizacion;

                console.log('Suma monto pagado:', item.suma_monto_pagado);
                console.log('monto semanal:', item.monto_semanal);
                console.log('Penalizacion semanal:', item.penalizacion_semanal);


                return item;

              });



            }

            this.editingCredito = results[1];

            this.num_contrato.setValue(this.editingCredito.num_contrato);
            this.num_contrato_historico.setValue(this.editingCredito?.num_contrato_historico);
            this.tarifa_id.setValue(this.editingCredito.tarifa.id);
            this.tipo_credito_id.setValue(this.editingCredito.tipoCredito.id);
            this.renovacion.setValue(this.editingCredito.renovacion);
            const montoSemanal = this.editingCredito.tarifa.monto_semanal;

            const montoSemanalF = this.customCurrencyPipe.transform(Number(montoSemanal));
            const montoOtorgadoF = this.customCurrencyPipe.transform(Number(this.editingCredito.monto_otorgado));
            const montoTotalF = this.customCurrencyPipe.transform(Number(this.editingCredito.monto_total));

            
            this.monto_semanal.setValue(montoSemanalF);
            this.monto_otorgado.setValue(montoOtorgadoF);
            this.monto_total.setValue(montoTotalF);
            this.fecha_inicio_prog.setValue(this.editingCredito.fecha_inicio_prog);
            this.fecha_fin_prog.setValue(this.editingCredito?.fecha_fin_prog_proyecta);
            this.fecha_entrega_prog.setValue(this.editingCredito.fecha_entrega_prog);
            this.solicitud_credito_id.setValue(this.editingCredito.solicitud_credito_id);
            this.nombre.setValue(this.editingCredito.cliente.nombre_completo);

            //preguntamos si trae numero de contrato historico

            this.total_penalizaciones = this.total_dias_penalizaciones * Number(this.editingCredito.monto_otorgado * .010 )

            console.log('Total $ Penalizaciones', this.total_penalizaciones);

          
            console.log(this.editingCredito.monto_otorgado);
            console.log(this.total_pagado);

            this.grand_total = ( Number(this.editingCredito.monto_total) - this.total_pagado ) + this.total_penalizaciones
            




          });




      }

    });

    // Despues de que ya hicimos todo, aqui podemos simplemente establecer el setpath y 
    // y redirigir a la lista de creditos por cliente si es que hay queryParams
    this.route.queryParams.subscribe((qParams) => {

      if (qParams.user_id) {

        this.pathService.path = '/dashboard/clientes/creditos/cliente/' + qParams.user_id;
      }


    });

  }

  loadCreditoData(credito: Credito) {

    this.id?.setValue(credito.id);
    this.num_contrato?.setValue(credito.num_contrato);
    this.num_contrato_historico?.setValue(credito.num_contrato_historico);

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


    //preguntamos el role, y con esto habilitamos las fechas de entrega y fecha de inicio.
    if (credito?.locked === 1) {
      this.fecha_inicio_prog.disable();
      this.fecha_entrega_prog.disable();
    }

    //this.getSolicitudesException(this.solicitud_credito_id.value);
    this.getCreditosException(credito.solicitud_credito_id)


  }

  getCreditosException(id: number) {

    this.creditos
      .filter(item => item.preaprobado === 1 || item.solicitud_credito_id === id)
      .map((credito) => {
        credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
        return credito;
      });


  }

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
    this.router.navigate(['/dashboard/creditos2']);
  }

  setPath() {
    this.pathService.path = '/dashboard/creditos2';
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

  get num_contrato_historico() {
    return this.creditoForm.get('num_contrato_historico');
  }

  get nombre() {
    return this.creditoForm.get('nombre');
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
