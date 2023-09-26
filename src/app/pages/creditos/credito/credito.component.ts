import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ChildActivationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Credito } from 'src/app/interfaces/Credito';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { CreditosService } from '../../../services/creditos.service';
import { TarifasService } from '../../../services/tarifas.service';
import { Tarifa } from '../../../interfaces/Tarifa';
import { FinanciamientosService } from 'src/app/services/financiamientos.service';
import { TipoCreditoService } from '../../../services/tipo-credito.service';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.css']
})
export class CreditoComponent implements OnInit {

  @ViewChild('fechaInicio') fecha_inicio_input: ElementRef;
  @ViewChild('selectTipoCredito') selectTipoCredito: NgSelectComponent;
  @ViewChild('inputRenovacion') inputRenovacion: ElementRef;

  creditos: Credito[] = [];
  solicitudes: any[] = [];
  tarifas: any[] = [];
  financiamientos: any[] = [];
  tipoCreditos: any[] = [];
  tipoContratos: any[] = [];

  creditoForm = this.fb.group({
    id: new FormControl(null),
    solicitud_credito_id: new FormControl(null, Validators.required),
    tipo_credito_id: new FormControl(null, Validators.required),
    tipo_contrato_id: new FormControl(null),
    fuente_financ_id: new FormControl(null),
    monto_otorgado: new FormControl(null, Validators.required),
    monto_total: new FormControl(null, Validators.required),
    fecha_creacion: new FormControl(null),
    fecha_entrega_prog: new FormControl(null),
    fecha_inicio_prog: new FormControl(null, Validators.required),
    fecha_fin_prog: new FormControl(null, Validators.required),
    tarifa_id: new FormControl(null, Validators.required),
    cliente_id: new FormControl(null, Validators.required),
    renovacion: new FormControl(null),
    estatus_credito_id: new FormControl(null, Validators.required),
  });

  editingCredito: Credito;
  tarifaSelected: Tarifa;
  solicitudSelected: Solicitud;
  creditoSelected: Credito;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private creditoService: CreditosService,
    private solService: SolicitudesService,
    private tarifaService: TarifasService,
    private financiamientoService: FinanciamientosService,
    private tipoCreditoService: TipoCreditoService,
    private tipoContratoService: TipoContratoService
  ) {

    //let year = new Date().getFullYear();

    this.creditoForm.setValue({
      id: null,
      solicitud_credito_id: null,
      tipo_credito_id: null,
      tipo_contrato_id: null,
      fuente_financ_id: null,
      fecha_entrega_prog: null,
      fecha_creacion: new Date(),
      fecha_inicio_prog: null,
      fecha_fin_prog: null,
      monto_otorgado: 0.00,
      monto_total: 0.00,
      tarifa_id: null,
      cliente_id: null,
      estatus_credito_id: 4,
      renovacion: null
    });
  }

  ngOnInit(): void {

    this.loadData();

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.creditoService.getCredito(params.id).subscribe(res => {

          this.editingCredito = res;

          this.id?.setValue(this.editingCredito.id);
          this.num_contrato?.setValue(this.editingCredito.num_contrato);
          this.solicitud_credito_id?.setValue(this.editingCredito.solicitud_credito_id);
          this.tarifa_id?.setValue(this.editingCredito.tarifa_id);
          this.monto_otorgado?.setValue(this.editingCredito.monto_otorgado);
          this.monto_total?.setValue(this.editingCredito.monto_total);
          this.fecha_inicio_prog?.setValue(this.formatFecha(this.editingCredito.fecha_inicio_prog));
          this.fecha_fin_prog?.setValue(this.formatFecha(this.editingCredito.fecha_fin_prog));
          this.fecha_entrega_prog?.setValue(this.formatFecha(this.editingCredito.fecha_entrega_prog));
          this.renovacion?.setValue(this.editingCredito.renovacion);
          this.tipo_credito_id?.setValue(this.editingCredito.tipo_credito_id);
          this.fuente_financ_id?.setValue(this.editingCredito.fuente_financ_id);
          this.tipo_contrato_id?.setValue(this.editingCredito.tipo_contrato_id);
          this.cliente_id?.setValue(this.editingCredito.cliente_id);

          //this.getSolicitudesException(this.solicitud_credito_id.value);
          this.getCreditosException(this.solicitud_credito_id.value);



        });


      }
    });

  }

  loadData() {

    this.setPath();

    this.getCreditos();
    //this.getSolicitudes();
    this.getTarifas();
    this.getFinanciamientos()
    this.getTipoCreditos();
    this.getTipoContratos();

  }

  getCreditos(){
    this.creditoService.getCreditos().subscribe(creditos => {

      this.creditos = creditos
        .filter(item => item.preaprobado === 1 )
        .map( (credito)=>{
          credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
          return credito;
        });

    });
  }

  getCreditosException(id:number){

    this.creditoService.getCreditos().subscribe(creditos => {

      this.creditos = creditos
        .filter(item => item.preaprobado === 1 || item.solicitud_credito_id === id )
        .map( (credito)=>{
          credito.nombre = `${credito.solicitud_credito_id} | ${credito.nombre} ${credito.apellido_paterno} ${credito.apellido_materno}`
          return credito;
        });

    });
  }

  // getSolicitudes() {

  //   this.solService.getSolicitudes().subscribe(solicitudes => {

  //     //El estatus 7 es APROBADA para entrega

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
  //       .filter(item => item.estatus_sol_id === 7 || item.id === id )
  //       //.filter(item => item.locked != 1)
  //       .map((sol) => {
  //         sol.nombre = `${sol.id} | ${sol.nombre} ${sol.apellido_paterno} ${sol.apellido_materno}`
  //         return sol;
  //       });


  //   })
  // }

  getTarifas() {
    this.tarifaService.getTarifas().subscribe(tarifas => {
      this.tarifas = tarifas;
    })
  }

  getFinanciamientos() {
    this.financiamientoService.getFinanciamientos().subscribe(financiamientos => {
      this.financiamientos = financiamientos;
    });
  }

  getTipoCreditos() {
    this.tipoCreditoService.getTipoCreditos().subscribe(tc => {
      this.tipoCreditos = tc;
    });
  }

  getTipoContratos() {
    this.tipoContratoService.getTipoContratos().subscribe(tc => {
      this.tipoContratos = tc;
    });
  }

  onChangeTarifa(event: any) {

    //Cada que se cambie la tarifa se tiene que resetear las fechas
    this.tarifaService.getTarifa(event.id).subscribe(tarifa => {

      this.tarifaSelected = tarifa;
      let calculo = 0;

      if (this.id) {

        //calculo = Number(this.solicitudSelected?.monto) + Number(this.solicitudSelected?.monto * tarifa.cociente);
        calculo = Number(this.creditoSelected?.monto_otorgado) + Number(this.creditoSelected?.monto_otorgado * tarifa.cociente);

      } else {

        //calculo = Number(this.editingCredito?.monto_otorgado) + Number(this.editingCredito?.monto_otorgado * tarifa.cociente);
        calculo = Number(this.creditoSelected?.monto_otorgado) + Number(this.creditoSelected?.monto_otorgado * tarifa.cociente);
      }

      this.monto_total?.setValue((Number(calculo).toFixed(2)));

    });

    this.limpiarFechas();

  }

  saveCredito() {

    if (this.creditoForm.valid) {

      if (this.creditoForm.value.id != null) {

        this.creditoService.updateCredito(this.creditoForm.value).subscribe((res: any) => {

          this.toastr.success(res['msg']);
          this.router.navigateByUrl(`/dashboard/creditos/credito/view/${res.id}`);

        });
      } else {

        this.creditoService.insertCredito(this.creditoForm.value).subscribe((res: any) => {

          this.toastr.success(res['msg']);
          this.router.navigateByUrl(`/dashboard/creditos/credito/view/${res.id}`);

        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      

    } else {
      this.toastr.error('Formulario no valido');
    }
  }

  onChangeSolicitud(event: any) {

    if (event) {

      //this.solicitudSelected = this.solicitudes.filter(sol => sol.id == event.id) as unknown as Solicitud;
      //this.solicitudSelected = this.solicitudSelected[0];

      this.creditoSelected = this.creditos.filter(credito => credito.id === event.id) as unknown as Credito;
      this.creditoSelected = this.creditoSelected[0];

      //this.populateCreditoFields(this.solicitudSelected);
      this.populateCreditoFields(this.creditoSelected);

      // const Event = {
      //   id: this.solicitudSelected.tarifa_id
      // }

      const Event = {
        id: this.creditoSelected.tarifa_id
      }

      this.onChangeTarifa(Event);
      this.fecha_inicio_input.nativeElement.readOnly = false;

      //Cambia el tipo de contrato
      //this.detectWhatTypeOfContratoIs(this.solicitudSelected.cliente_id);
      this.detectWhatTypeOfContratoIs(this.creditoSelected.cliente_id);

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
        this.fecha_fin_prog.setValue(this.formatFecha(this.sumarDias(fecha_aux, num_dias)));

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

  detectWhatDayIs(fecha: any) {

    let whatday = new Date(fecha);

    return whatday.getDay();
  }

  detectWhatTypeOfContratoIs(id: number) {

    this.creditoService.getCreditos().subscribe(creditos => {

      let contador = 0;

      creditos.forEach(credito => {
        if (credito.cliente_id === id 
          // && credito.locked === 1
          ) {
          
          contador = contador + 1;
        }


      })

      if (contador === 0) {
        //El 1 significa primer credito
        this.tipo_credito_id.setValue(1);
      } else {
        //El 2 significa segundo credito
        this.tipo_credito_id.setValue(2);
        this.inputRenovacion.nativeElement.value = contador;
        this.renovacion?.setValue(contador);

      }

    })
  }

  populateCreditoFields(data: Credito) {

    this.tarifa_id?.setValue(data.tarifa_id);
    //this.monto_otorgado?.setValue(data.monto);
    this.monto_otorgado?.setValue(data.monto_otorgado)
    this.cliente_id?.setValue(data.cliente_id);

  }

  formatFecha(date: Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  setPath() {
    this.pathService.path = '/dashboard/creditos';
  }

  volver() {
    this.router.navigate(['/dashboard/creditos']);
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

}
