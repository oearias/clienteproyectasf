import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Agencia } from 'src/app/interfaces/Agencia';
import { Cliente } from 'src/app/interfaces/Cliente';
import { Ocupacion } from 'src/app/interfaces/Ocupacion';
import { Parentesco } from 'src/app/interfaces/Parentesco';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { TipoEmpleo } from 'src/app/interfaces/TipoEmpleo';
import { TipoIdentificacion } from 'src/app/interfaces/TipoIdentificacion';
import { Zona } from 'src/app/interfaces/Zona';
import { AgenciasService } from 'src/app/services/agencias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ColoniasService } from 'src/app/services/colonias.service';
import { EstadosService } from 'src/app/services/estados.service';
import { OcupacionesService } from 'src/app/services/ocupaciones.service';
import { ParentescosService } from 'src/app/services/parentescos.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { TarifasService } from 'src/app/services/tarifas.service';
import { TipoEmpleoService } from 'src/app/services/tipo-empleo.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { ZonasService } from 'src/app/services/zonas.service';

import { EstatusSolicitud } from '../../../interfaces/EstatusSolicitud';
import { SolEstatusService } from '../../../services/sol-estatus.service';
import { MontosService } from '../../../services/montos.service';
import { PathService } from '../../../services/path.service';
import { CreditosService } from '../../../services/creditos.service';
import { Credito } from 'src/app/interfaces/Credito';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SolEventosService } from '../../../services/sol-eventos.service';
import { SolicitudEvento } from 'src/app/interfaces/SolicitudEvento';

@Component({
  selector: 'app-solicitud-view',
  templateUrl: './solicitud-view.component.html',
  styleUrls: ['./solicitud-view.component.css']
})
export class SolicitudViewComponent implements AfterViewInit {
  @ViewChild('bsStepper', { static: false }) stepperElement!: ElementRef<any>;
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @ViewChild('selectSucursal') selectSucursal: NgSelectComponent;
  @ViewChild('selectZona') selectZona: NgSelectComponent;
  @ViewChild('selectAgencia') selectAgencia: NgSelectComponent;
  @ViewChild('selectColonia') selectColonia: NgSelectComponent;
  @ViewChild('selectEstatus') selectEstatus: NgSelectComponent;
  @ViewChild('cp') cp: ElementRef;
  @ViewChild('cp2') cp2: ElementRef;
  @ViewChild('viviendaOtra') viviendaOtra: ElementRef;
  @ViewChild('observaciones') inputObservaciones: ElementRef;
  @ViewChild('btnChangeEstatus') btnChangeEstatus: ElementRef;

  @ViewChild('numCliente') numCliente: ElementRef;
  @ViewChild('inputNombreCompleto') nombreCompleto: ElementRef;
  @ViewChild('inputSucursal') inputSucursal: ElementRef;
  @ViewChild('inputZona') inputZona: ElementRef;
  @ViewChild('inputAgencia') inputAgencia: ElementRef;
  @ViewChild('inputTotalCreditos') inputTotalCreditos: ElementRef;

  public stepper!: Stepper;

  sucursales: any = [];
  zonas: any = [];
  agencias: any = [];
  montos: any = [];
  tarifas: any = [];
  clientes: any = [];
  clienteSelected: Cliente[];
  editingSolicitud: Solicitud;
  editingCliente: Cliente;
  estados: any = [];
  colonias: any = [];
  parentescos: Parentesco[] = [];

  parametros :any = [];

  creditos : Credito[] = [];
  creditosArray: Credito[] = [];
  agenciasArray: Agencia[] = [];
  zonasArray: Zona[] = [];
  clientesArray: Cliente[];
  estatusArray: EstatusSolicitud[] = [];
  ocupaciones: Ocupacion[] = [];
  tipoEmpleos: TipoEmpleo[] = [];
  tipoIdentificaciones: TipoIdentificacion[] = [];
  estatuss: EstatusSolicitud[] = [];
  eventos: SolicitudEvento[] = [];


  totalCreditos: number = 0;

  role:any;

  arrSexo: any[] = [
    { nombre: 'FEMENINO' },
    { nombre: 'MASCULINO' }
  ];

  arrPeriodicidad: any[] = [
    { nombre: 'SEMANAL' },
    { nombre: 'QUINCENAL' },
    { nombre: 'MENSUAL' }
  ];

  solicitudForm = this.fb.group({
    id: new FormControl(null),
    cliente_id: new FormControl(null),
    tarifa_id: new FormControl(null, [Validators.required]),
    estatus_sol_id: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    ocupacion_id: new FormControl(null, [Validators.required]),
    tipo_empleo_id: new FormControl(null, [Validators.required]),
    tipo_identificacion_id: new FormControl(null, [Validators.required]),
    num_identificacion: new FormControl(null, [Validators.required]),
    periodicidad_ingresos: new FormControl(null, [Validators.required]),
    color_casa: new FormControl(null, [Validators.required]),
    color_porton: new FormControl(null, [Validators.required]),
    niveles_casa: new FormControl(null, [Validators.required]),
    parentesco_contacto1: new FormControl(null, [Validators.required]),
    parentesco_contacto2: new FormControl(null, [Validators.required]),
    nombre_contacto1: new FormControl(null, [Validators.required]),
    nombre_contacto2: new FormControl(null, [Validators.required]),
    telefono_contacto1: new FormControl(null, [Validators.required]),
    telefono_contacto2: new FormControl(null, [Validators.required]),
    direccion_contacto1: new FormControl(null, [Validators.required]),
    direccion_contacto2: new FormControl(null, [Validators.required]),
    ingreso_mensual: new FormControl(null, Validators.required),
    observaciones_negocio: new FormControl(null),
    tiempo_vivienda_años: new FormControl(null),
    tiempo_vivienda_meses: new FormControl(null),
    tiempo_empleo_años: new FormControl(null),
    tiempo_empleo_meses: new FormControl(null),
    sucursal_id: new FormControl(null),
    zona_id: new FormControl(null),
    agencia_id: new FormControl(null, [Validators.required]),
    fecha_solicitud: new FormControl(null, [Validators.required]),
    fecha_creacion: new FormControl(null),
    observaciones: new FormControl(null, Validators.required),
    usuario: new FormControl(null,),
    cliente: new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido_paterno: new FormControl(null, [Validators.required]),
      apellido_materno: new FormControl(null),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      sexo: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      rfc: new FormControl(null),
      curp: new FormControl(null),
      email: new FormControl(null, [Validators.required]),
      calle: new FormControl(null, [Validators.required]),
      colonia_id: new FormControl(null, [Validators.required]),
      num_ext: new FormControl(null, [Validators.required]),
      num_int: new FormControl(null),
      cruzamientos: new FormControl(null),
      referencia: new FormControl(null),
      municipio: new FormControl(null, [Validators.required]),
      localidad: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
    }),
    servicios: new FormGroup({
      luz: new FormControl(null),
      agua_potable: new FormControl(null),
      auto_propio: new FormControl(null),
      telefono_fijo: new FormControl(null),
      telefono_movil: new FormControl(null),
      refrigerador: new FormControl(null),
      estufa: new FormControl(null),
      internet: new FormControl(null),
      gas: new FormControl(null),
      tv: new FormControl(null),
      alumbrado_publico: new FormControl(null),
    }),
    personas_viviendo: new FormControl(null),
    num_dependientes: new FormControl(null),
    vivienda: new FormControl(null, [Validators.required]),
    vivienda_otra: new FormControl(null),
    colonia_id: new FormControl(null),
  });

  constructor(
    private pathService: PathService,
    private datePipe: DatePipe,
    private sucursalService: SucursalesService,
    private zonaService: ZonasService,
    private agenciaService: AgenciasService,
    private tarifaService: TarifasService,
    private montoService: MontosService,
    private clienteService: ClientesService,
    private coloniaService: ColoniasService,
    private estadoService: EstadosService,
    private ocupacionService: OcupacionesService,
    private parentescoService: ParentescosService,
    private tipoEmpleoService: TipoEmpleoService,
    private estatusService: SolEstatusService,
    private tipoIdentificacionService: TipoIdentificacionService,
    private solicitudService: SolicitudesService,
    private solEventosService: SolEventosService,
    private creditoService: CreditosService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    let fechaHoy = new Date();

    this.solicitudForm.setValue({
      id: null,
      cliente_id: null,
      monto: null,
      tarifa_id: null,
      estatus_sol_id: null,  //ABIERTA
      fecha_creacion: null,
      fecha_solicitud: this.datePipe.transform(fechaHoy),
      ocupacion_id: null,
      tipo_empleo_id: null,
      tipo_identificacion_id: null,
      num_identificacion: null,
      color_casa: null,
      niveles_casa: null,
      color_porton: null,
      parentesco_contacto1: null,
      parentesco_contacto2: null,
      nombre_contacto1: null,
      nombre_contacto2: null,
      telefono_contacto1: null,
      telefono_contacto2: null,
      direccion_contacto1: null,
      direccion_contacto2: null,
      tiempo_vivienda_años: null,
      tiempo_vivienda_meses: null,
      tiempo_empleo_años: null,
      tiempo_empleo_meses: null,
      observaciones_negocio: null,
      periodicidad_ingresos: 'QUINCENAL',
      sucursal_id: null,
      zona_id: null,
      agencia_id: null,
      vivienda: 'VIVIENDA PROPIA',
      vivienda_otra: null,
      ingreso_mensual: null,
      num_dependientes: null,
      personas_viviendo: null,
      observaciones: null,
      usuario: localStorage.getItem('usuario'),
      cliente: {
        nombre: null,
        apellido_paterno: null,
        apellido_materno: null,
        fecha_nacimiento: null,
        sexo: null,
        telefono: null,
        rfc: null,
        curp: null,
        email: null,
        calle: null,
        colonia_id: null,
        num_ext: null,
        num_int: null,
        cruzamientos: null,
        referencia: null,
        municipio: 'CARMEN',
        localidad: 'CD. DEL CARMEN',
        estado: 'CAMPECHE',
      },
      servicios: {
        luz: false,
        agua_potable: false,
        auto_propio: false,
        telefono_fijo: false,
        telefono_movil: false,
        refrigerador: false,
        estufa: false,
        internet: false,
        gas: false,
        tv: false,
        alumbrado_publico: false
      },
      colonia_id: null,

    });

    this.solicitudForm.disable();
    this.estatus_sol_id.disable();
    this.monto.disable();
    

    this.role = localStorage.getItem('role');

  }

  next() {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }

  ngAfterViewInit(): void {

    this.setPath();

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.loadData();

    $('#exampleRadios1').on('change', () => {
      this.solicitudForm.controls['vivienda_otra'].disable();
      this.vivienda_otra.setValue(null)
    });

    $('#exampleRadios2').on('change', () => {
      this.solicitudForm.controls['vivienda_otra'].disable();
      this.vivienda_otra.setValue(null)
    });

    $('#exampleRadios3').on('change', () => {
      this.solicitudForm.controls['vivienda_otra'].enable();
    });

    //Llenamos la solicitud si existen parametros
    this.route.params.subscribe(params => {
      if (params.id) {

        this.solicitudService.getSolicitud(params.id).subscribe((res: any) => {

          this.editingSolicitud = res;

          this.nombreCompleto.nativeElement.value = res['nombre_completo'];
          this.inputSucursal.nativeElement.value = res['sucursal'];
          this.inputZona.nativeElement.value = res['zona'];
          this.inputAgencia.nativeElement.value = res['agencia'];

          /////Populamos Selects
          const selects = {
            sucursal: {
              id: res.sucursal_id
            },
            zona: {
              id: res.zona_id
            }
          }

          this.onChangeSucursal(selects.sucursal);
          this.onChangeZona(selects.zona);

          //Datos de la Solicitud

          this.id?.setValue(res.id);
          this.fecha_solicitud?.setValue(this.datePipe.transform(res.fecha_solicitud, 'yyyy-MM-dd', '0+100'));
          this.monto?.setValue(res.monto);
          this.tarifa_id?.setValue(res.tarifa_id);
          this.vivienda?.setValue(res.vivienda);
          this.vivienda_otra?.setValue(res.vivienda_otra);
          this.tiempo_vivienda_años?.setValue(res.tiempo_vivienda_años);
          this.tiempo_vivienda_meses?.setValue(res.tiempo_vivienda_meses);
          this.observaciones_negocio?.setValue(res.observaciones_negocio);
          this.tiempo_empleo_años?.setValue(res.tiempo_empleo_años);
          this.tiempo_empleo_meses?.setValue(res.tiempo_empleo_meses);
          this.parentesco_contacto1?.setValue(res.parentesco_contacto1);
          this.parentesco_contacto2?.setValue(res.parentesco_contacto2);
          this.nombre_contacto1?.setValue(res.nombre_contacto1);
          this.nombre_contacto2?.setValue(res.nombre_contacto2);
          this.telefono_contacto1?.setValue(res.telefono_contacto1);
          this.telefono_contacto2?.setValue(res.telefono_contacto2);
          this.direccion_contacto1?.setValue(res.direccion_contacto1);
          this.direccion_contacto2?.setValue(res.direccion_contacto2);
          this.num_identificacion?.setValue(res.num_identificacion);
          this.ingreso_mensual?.setValue(res.ingreso_mensual);
          this.personas_viviendo?.setValue(res.personas_viviendo);
          this.num_dependientes?.setValue(res.num_dependientes);
          this.color_casa?.setValue(res.color_casa);
          this.color_porton?.setValue(res.color_porton);
          this.niveles_casa?.setValue(res.niveles_casa);

          ////SELECTS
          this.sucursal_id.setValue(res.sucursal_id);
          this.zona_id.setValue(res.zona_id);
          this.agencia_id.setValue(res.agencia_id);
          this.tipo_empleo_id?.setValue(res.tipo_empleo_id);
          this.ocupacion_id?.setValue(res.ocupacion_id);
          this.tipo_identificacion_id?.setValue(res.tipo_identificacion_id);
          this.colonia_id?.setValue(res.colonia_id);
          this.estatus_sol_id?.setValue(res.estatus_sol_id);

          this.servicios.get('luz').setValue(res.luz);
          this.servicios.get('agua_potable').setValue(res.agua_potable);
          this.servicios.get('auto_propio').setValue(res.auto_propio);
          this.servicios.get('telefono_fijo').setValue(res.telefono_fijo);
          this.servicios.get('telefono_movil').setValue(res.telefono_movil);
          this.servicios.get('refrigerador').setValue(res.refrigerador);
          this.servicios.get('estufa').setValue(res.estufa);
          this.servicios.get('internet').setValue(res.internet);
          this.servicios.get('gas').setValue(res.gas);
          this.servicios.get('tv').setValue(res.tv);
          this.servicios.get('alumbrado_publico').setValue(res.alumbrado_publico);

          //Datos del solicitante
          this.populateClienteFields(res);
          this.numCliente.nativeElement.value = res.num_cliente;

          //Cargamos los eventos...
          this.solEventosService.getEventosBySolicitudId(params.id).subscribe(res =>{
            this.eventos = res;

          });

          //Esto se cambió por dos botones
          //Desactivamos los botones si ya está aprobada o rechazada
          // if ((this.editingSolicitud.estatus === 'RECHAZADA') || (this.editingSolicitud.estatus === 'APROBADA')) {
          //   this.btnChangeEstatus.nativeElement.disabled = true;
          // }

          if (
            (this.role === 'ADMIN' || this.role === 'EDITOR')
            && ((this.estatus_sol_id?.value === 3) )
          ) {
      
            this.monto.enable();
            this.tarifa_id.enable();
            this.estatus_sol_id.enable();
            this.monto.enable();
            this.observaciones.enable();
      
          }


        });
      }
    });

  }

  onSubmit() { }

  loadData() {

    this.getSucursales();
    this.loadZonas();
    this.loadAgencias();
    this.loadTarifas();
    this.loadMontos();
    this.loadClientes();
    this.loadColonias();
    this.loadEstados();
    this.loadOcupaciones();
    this.loadParentescos();
    this.loadTipoEmpleo();
    this.loadTipoIdentificacion();
    this.loadEstatus();
    this.loadCreditos();

  }

  getSucursales() {
    this.sucursalService.getSucursales().subscribe(res => {
      this.sucursales = res;
    });
  }

  loadZonas() {
    this.zonaService.getZonas().subscribe((res: any) => {
      this.zonasArray = res;
    });
  }

  loadAgencias() {
    this.agenciaService.getAgencias().subscribe((res: any) => {
      this.agenciasArray = res;
    })
  }

  loadTarifas() {
    this.tarifaService.getTarifas().subscribe(res => {
      this.tarifas = res;
    })
  }

  loadMontos() {
    this.montoService.getMontos().subscribe(montos => {
      this.montos = montos;
    })
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe((clientes: any) => {
      this.clientes = clientes.map((cliente) => {
        cliente.fullName = `${cliente.nombre_completo} |  ${cliente.rfc} `;
        return cliente;
      });

      this.clientesArray = clientes;
    });
  }

  loadColonias() {
    this.coloniaService.getColonias().subscribe((colonias: any) => {
      this.colonias = colonias;
    })
  }

  loadEstados() {
    this.estadoService.getEstados().subscribe((estados: any) => {
      this.estados = estados;
    });
  }

  loadOcupaciones() {
    this.ocupacionService.getOcupaciones().subscribe((ocupaciones: any) => {
      this.ocupaciones = ocupaciones;
    });
  }

  loadEstatus() {
    this.estatusService.getEstatus().subscribe((estatus: any) => {

      this.estatuss = estatus;
      this.estatusArray = estatus;

    });

  }

  loadParentescos() {
    this.parentescoService.getParentescos().subscribe((parentescos: any) => {
      this.parentescos = parentescos;
    });
  }

  loadTipoEmpleo() {
    this.tipoEmpleoService.getTipoEmpleos().subscribe((tipoEmpleos: any) => {
      this.tipoEmpleos = tipoEmpleos;
    });
  }

  loadTipoIdentificacion() {
    this.tipoIdentificacionService.getTipoIdentificaciones().subscribe((res: any) => {
      this.tipoIdentificaciones = res;
    });
  }

  loadCreditos() {
    this.creditoService.getCreditos().subscribe(creditos => {
      this.creditos = creditos.filter(item => item.cliente_id === this.editingSolicitud?.cliente_id);
      this.totalCreditos = this.creditos.length;
    });
  }
  

  onChangeSucursal(event: any) {

    this.zonas = Array.from(this.zonasArray).filter(zona =>
      zona.sucursal_id == event.id
    );

    if (this.zonas.length < 0) {
    } else {
      //Remueve default values del ng-select cuando no hay res
      //this.selectZona.handleClearClick();
      this.selectZona.clearModel();
      this.selectAgencia.clearModel();
      this.onChangeZona(444); //Resetea el evento
    }

  }

  onChangeZona(event: any) {

    if (event) {

      this.agencias = Array.from(this.agenciasArray).filter(agencia =>
        agencia.zona_id === event.id
      )

      if (this.agencias.length < 0) {
      } else {
        this.selectAgencia.clearModel();
      }
    }
  }

  onChangeMonto(event: any) {

    if (event) {
      this.tarifa_id?.setValue(event.tarifa_id);
    }
  }

  onChangeColonia(event: any, flag: number) {

    if (event.cp && flag === 1) {
      this.cp.nativeElement.value = event.cp
    } else {
      this.cp2.nativeElement.value = event.cp
    }
  }

  onLoadColonia(cp: number) {

    if (cp) {
      this.cp.nativeElement.value = cp;
    }
  }

  onChangeCliente(event: any) {

    if (event) {

      this.clienteSelected = this.clientesArray.filter(cliente => cliente.id == event.id);

      this.populateClienteFields(this.clienteSelected[0]);

    }
  }

  onClearEstatus() {

    //Volvemos al array original de estatus
    this.estatuss = this.estatusArray;

    this.estatus_sol_id?.setValue(this.editingSolicitud.estatus_sol_id);
  }

  onChangeEstatus(event: EstatusSolicitud) {

    if (event) {
      this.estatus_sol_id?.setValue(event.id);
      this.observaciones.enable();
    }

  }

  changeEstatus() {
    this.changeSolicitud(this.estatus_sol_id.value);
  }

  populateClienteFields(data: Cliente) {

    this.cliente_id?.setValue(data.id);

    this.cliente.get('nombre')?.setValue(data.nombre);
    this.cliente.get('apellido_paterno')?.setValue(data.apellido_paterno);
    this.cliente.get('apellido_materno')?.setValue(data.apellido_materno);
    this.cliente.get('fecha_nacimiento')?.setValue(this.datePipe.transform(data.fecha_nacimiento,'yyyy-MM-dd'));
    this.cliente.get('sexo')?.setValue(data.sexo);
    this.cliente.get('telefono')?.setValue(data.telefono);
    this.cliente.get('rfc')?.setValue(data.rfc);
    this.cliente.get('curp')?.setValue(data.curp);
    this.cliente.get('email')?.setValue(data.email);
    this.cliente.get('calle')?.setValue(data.calle);
    this.cliente.get('colonia_id')?.setValue(data.colonia_id);
    this.cliente.get('num_ext')?.setValue(data.num_ext);
    this.cliente.get('num_int')?.setValue(data.num_int);
    this.cliente.get('cp')?.setValue(data.cp);
    this.cliente.get('cruzamientos')?.setValue(data.cruzamientos);
    this.cliente.get('referencia')?.setValue(data.referencia);
    this.cliente.get('municipio')?.setValue(data.municipio);
    this.cliente.get('localidad')?.setValue(data.localidad);
    this.cliente.get('estado')?.setValue(data.estado);

    this.onLoadColonia(data.cp);
  }

  populateSolicitudFields(data: Solicitud) {

    ////SELECTS
    this.sucursal_id.setValue(data.sucursal_id);
    this.zona_id.setValue(data.zona_id);
    this.agencia_id.setValue(data.agencia_id);
    this.tipo_empleo_id?.setValue(data.tipo_empleo_id);
    this.ocupacion_id?.setValue(data.ocupacion_id);
    this.tipo_identificacion_id?.setValue(data.tipo_identificacion_id);

    //Datos de la solicitud
    this.id?.setValue(data.id);
    this.fecha_solicitud?.setValue(this.datePipe.transform(data.fecha_solicitud, 'yyyy-MM-dd', '0+100'));
    this.monto?.setValue(data.monto);
    this.tarifa_id?.setValue(data.tarifa_id);
    this.vivienda?.setValue(data.vivienda);
    this.vivienda_otra?.setValue(data.vivienda_otra);
    this.tiempo_vivienda_años?.setValue(data.tiempo_vivienda_años);
    this.tiempo_vivienda_meses?.setValue(data.tiempo_vivienda_meses);
    this.tiempo_empleo_años?.setValue(data.tiempo_empleo_años);
    this.tiempo_empleo_meses?.setValue(data.tiempo_empleo_meses);
    this.parentesco_contacto1?.setValue(data.parentesco_contacto1);
    this.parentesco_contacto2?.setValue(data.parentesco_contacto2);
    this.nombre_contacto1?.setValue(data.nombre_contacto1);
    this.nombre_contacto2?.setValue(data.nombre_contacto2);
    this.telefono_contacto1?.setValue(data.telefono_contacto1);
    this.telefono_contacto2?.setValue(data.telefono_contacto2);
    this.direccion_contacto1?.setValue(data.direccion_contacto1);
    this.direccion_contacto2?.setValue(data.direccion_contacto2);
    this.num_identificacion?.setValue(data.num_identificacion);
    this.ingreso_mensual?.setValue(data.ingreso_mensual);
    this.personas_viviendo?.setValue(data.personas_viviendo);
    this.num_dependientes?.setValue(data.num_dependientes);
    this.color_casa?.setValue(data.color_casa);
    this.color_porton?.setValue(data.color_porton);
    this.niveles_casa?.setValue(data.niveles_casa);

    //Servicios
    this.servicios.get('luz')?.setValue(data.luz);
    this.servicios.get('agua_potable')?.setValue(data.agua_potable);
    this.servicios.get('auto_propio')?.setValue(data.auto_propio);
    this.servicios.get('telefono_fijo')?.setValue(data.telefono_fijo);
    this.servicios.get('telefono_movil')?.setValue(data.telefono_movil);
    this.servicios.get('refrigerador')?.setValue(data.refrigerador);
    this.servicios.get('estufa')?.setValue(data.estufa);
    this.servicios.get('internet')?.setValue(data.internet);
    this.servicios.get('gas')?.setValue(data.gas);
    this.servicios.get('tv')?.setValue(data.tv);
    this.servicios.get('alumbrado_publico')?.setValue(data.alumbrado_publico);
  }

  onClearCliente() {
    this.cliente.reset();
    this.cp.nativeElement.value = null;
  }

  updateSolicitud() {

    this.solicitudService.updateSolicitud(this.solicitudForm.getRawValue()).subscribe((res: any) => {

      this.toastr.success(res);

      this.router.navigateByUrl('/dashboard/solicitudes');
    })

  }

  changeSolicitud(opt: number) {

    let title, verbo, icon, estatus, confirmButton;

    switch (opt) {

      case 1:
        title = 'Revertir solicitud';
        verbo = `revertir`;
        icon = 'question';
        confirmButton = 'Si, Revertir!';
        estatus = 1;
        break;

      case 2:
        title = 'Rechazar solicitud';
        verbo = `rechazar`;
        icon = 'warning';
        confirmButton = 'Si, Rechazar!';
        estatus = 2;
        break;

      case 5:
        title = 'Aprobar solicitud';
        verbo = `aprobar`;
        icon = 'question';
        confirmButton = 'Si!';
        estatus = 5;
        break;

    }

    //Si desea rechazar una solicitud, describir el por que no se aprobo la solicitud. Mediante otro sweet alert

    if (this.inputObservaciones.nativeElement.value.length > 0) {

      //this.observaciones?.setValue(this.inputObservaciones.nativeElement.value);
      this.estatus_sol_id?.setValue(estatus);

      Swal.fire({
        title: title,
        html: `¿Está ud. seguro que desea ${verbo} la solicitud <br><b>${this.id.value}</b>?`,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#2f5ade',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: confirmButton,
        confirmButtonAriaLabel: 'send'
      }).then((result) => {
        if (result.isConfirmed) {

          this.updateSolicitud();

        }
      });

    } else {

      Swal.fire({
        title: 'Ups! Faltan algunos datos',
        html: `Por favor establezca en el campo de observaciones un motivo para el cambio de solicitud`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok, Entiendo!',
        confirmButtonAriaLabel: 'send'
      });
    }


  }

  aprobarSolicitud() {

    Swal.fire({
      title: 'Aprobar',
      html: `¿Está ud. seguro de aprobar la solicitud <br><b>${this.id.value}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si! Aprobar',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        //Se cambia el estatus a aprobada pero no entregada
        this.estatus_sol_id?.setValue(6);
        this.updateSolicitud();

      }
    });

  }

  rechazarSolicitud() {

    Swal.fire({
      title: 'Rechazar',
      html: `¿Está ud. seguro de rechazar la solicitud <br><b>${this.id.value}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si! Rechazar',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        //Se cambia el estatus a rechazada
        this.estatus_sol_id?.setValue(2);
        this.updateSolicitud();

      }
    });

  }

  revertirSolicitud(){
    Swal.fire({
      title: 'Correción de solicitud',
      html: `¿Está ud. seguro de enviar a corrección la solicitud <br><b>${this.id.value}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si!',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        //Se cambia el estatus a rechazada
        this.estatus_sol_id?.setValue(1);
        this.updateSolicitud();

      }
    });
  }

  changeStatus() {

    Swal.fire({
      title: 'Enviar a aprobación',
      html: `¿Está ud. seguro de Enviar a aprobación la solicitud <br><b>${this.id.value}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Enviar!',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        this.estatus_sol_id?.setValue(3);
        this.updateSolicitud();

      }
    });

  }

  volver() {
    this.router.navigate(['/dashboard/solicitudes'])
  }

  setPath() {
    this.pathService.path = '/dashboard/solicitudes';
  }

  //Getters
  get id() {
    return this.solicitudForm.get('id');
  }

  get fecha_solicitud() {
    return this.solicitudForm.get('fecha_solicitud');
  }

  get estatus_sol_id() {
    return this.solicitudForm.get('estatus_sol_id');
  }

  get monto() {
    return this.solicitudForm.get('monto');
  }

  get cliente_id() {
    return this.solicitudForm.get('cliente_id');
  }

  get tarifa_id() {
    return this.solicitudForm.get('tarifa_id');
  }

  get parentesco_contacto1() {
    return this.solicitudForm.get('parentesco_contacto1');
  }

  get parentesco_contacto2() {
    return this.solicitudForm.get('parentesco_contacto2');
  }

  get nombre_contacto1() {
    return this.solicitudForm.get('nombre_contacto1');
  }

  get nombre_contacto2() {
    return this.solicitudForm.get('nombre_contacto2');
  }

  get telefono_contacto1() {
    return this.solicitudForm.get('telefono_contacto1');
  }

  get telefono_contacto2() {
    return this.solicitudForm.get('telefono_contacto2');
  }

  get direccion_contacto1() {
    return this.solicitudForm.get('direccion_contacto1');
  }

  get direccion_contacto2() {
    return this.solicitudForm.get('direccion_contacto2');
  }

  get sucursal_id() {
    return this.solicitudForm.get('sucursal_id');
  }

  get zona_id() {
    return this.solicitudForm.get('zona_id');
  }

  get agencia_id() {
    return this.solicitudForm.get('agencia_id');
  }

  get colonia_id() {
    return this.solicitudForm.get('colonia_id');
  }

  get cliente() {
    return this.solicitudForm.get('cliente');
  }

  get servicios() {
    return this.solicitudForm.get('servicios');
  }

  get vivienda() {
    return this.solicitudForm.get('vivienda');
  }

  get vivienda_otra() {
    return this.solicitudForm.get('vivienda_otra');
  }

  get num_dependientes() {
    return this.solicitudForm.get('num_dependientes');
  }

  get personas_viviendo() {
    return this.solicitudForm.get('personas_viviendo');
  }

  get tiempo_vivienda_años() {
    return this.solicitudForm.get('tiempo_vivienda_años');
  }

  get tiempo_vivienda_meses() {
    return this.solicitudForm.get('tiempo_vivienda_meses');
  }

  get observaciones_negocio() {
    return this.solicitudForm.get('observaciones_negocio');
  }

  get tiempo_empleo_años() {
    return this.solicitudForm.get('tiempo_empleo_años');
  }

  get tiempo_empleo_meses() {
    return this.solicitudForm.get('tiempo_empleo_meses');
  }

  get tipo_empleo_id() {
    return this.solicitudForm.get('tipo_empleo_id');
  }

  get ocupacion_id() {
    return this.solicitudForm.get('ocupacion_id');
  }

  get tipo_identificacion_id() {
    return this.solicitudForm.get('tipo_identificacion_id');
  }

  get num_identificacion() {
    return this.solicitudForm.get('num_identificacion');
  }

  get ingreso_mensual() {
    return this.solicitudForm.get('ingreso_mensual');
  }

  get niveles_casa() {
    return this.solicitudForm.get('niveles_casa');
  }

  get color_casa() {
    return this.solicitudForm.get('color_casa');
  }

  get color_porton() {
    return this.solicitudForm.get('color_porton');
  }

  get observaciones() {
    return this.solicitudForm.get('observaciones');
  }

  get usuario(){
    return this.solicitudForm.get('usuario');
  }

}
