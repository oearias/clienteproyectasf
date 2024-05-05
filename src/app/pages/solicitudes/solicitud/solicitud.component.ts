import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import Stepper from 'bs-stepper';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';

import { Ocupacion } from 'src/app/interfaces/Ocupacion';
import { Agencia } from '../../../interfaces/Agencia';
import { Zona } from '../../../interfaces/Zona';
import { Cliente } from '../../../interfaces/Cliente';
import { TipoEmpleo } from '../../../interfaces/TipoEmpleo';
import { TipoIdentificacion } from '../../../interfaces/TipoIdentificacion';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { Parentesco } from '../../../interfaces/Parentesco';

import { ZonasService } from 'src/app/services/zonas.service';
import { SucursalesService } from '../../../services/sucursales.service';
import { AgenciasService } from 'src/app/services/agencias.service';
import { TarifasService } from '../../../services/tarifas.service';
import { OcupacionesService } from '../../../services/ocupaciones.service';
import { ClientesService } from '../../../services/clientes.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { TipoIdentificacionService } from '../../../services/tipo-identificacion.service';
import { ColoniasService } from '../../../services/colonias.service';
import { EstadosService } from '../../../services/estados.service';
import { TipoEmpleoService } from '../../../services/tipo-empleo.service';
import { ParentescosService } from '../../../services/parentescos.service';
import { MontosService } from '../../../services/montos.service';
import { Monto } from '../../../interfaces/Monto';
import { PathService } from '../../../services/path.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})

export class SolicitudComponent implements AfterViewInit {
  @ViewChild('bsStepper', { static: false }) stepperElement!: ElementRef<any>;
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @ViewChild('selectSucursal') selectSucursal: NgSelectComponent;
  @ViewChild('selectZona') selectZona: NgSelectComponent;
  @ViewChild('selectAgencia') selectAgencia: NgSelectComponent;
  @ViewChild('selectMonto') selectMonto: NgSelectComponent;
  @ViewChild('selectTarifa') selectTarifa: NgSelectComponent;
  @ViewChild('selectColonia') selectColonia: NgSelectComponent;
  @ViewChild('selectTipoSolicitud') selectTipoSolicitud: NgSelectComponent;
  @ViewChild('cp') cp: ElementRef;
  @ViewChild('cp2') cp2: ElementRef;
  @ViewChild('viviendaOtra') viviendaOtra: ElementRef;

  public stepper!: Stepper;

  fechaHoy : Date;

  busqueda = '';

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

  agenciasArray: Agencia[] = [];
  zonasArray: Zona[] = [];
  montosArray: Monto[] = [];
  clientesArray: Cliente[];
  ocupaciones: Ocupacion[] = [];
  tipoEmpleos: TipoEmpleo[] = [];
  tipoIdentificaciones: TipoIdentificacion[] = [];

  public items$: Observable<Cliente[]>;
  public input$ = new Subject<string | null>();

  //@Input() required: boolean = false;

  submitted: boolean;
  formularioMicroNegocioIsRequired: boolean = false;

  arrayTipoSolicitud: any[] = [
    {id: 1, nombre: 'PERSONAL'},
    {id: 2, nombre: 'MICRONEGOCIO'}
  ]

  arrSexo: any[] = [
    { nombre: 'FEMENINO' },
    { nombre: 'MASCULINO' }
  ];

  arrPeriodicidad: any[] = [
    { nombre: 'DIARIO' },
    { nombre: 'SEMANAL' },
    { nombre: 'QUINCENAL' },
    { nombre: 'MENSUAL' }
  ];

  solicitudForm = this.fb.group({
    id:                     new FormControl(null),
    tipo_solicitud:         new FormControl(null, [Validators.required]),
    cliente_id:             new FormControl(null),
    tarifa_id:              new FormControl(null, [Validators.required]),
    estatus_sol_id:         new FormControl(null, [Validators.required]),
    monto:                  new FormControl(null),
    ocupacion_id:           new FormControl(null),
    tipo_empleo_id:         new FormControl(null),
    tipo_identificacion_id: new FormControl(null),
    num_identificacion:     new FormControl(null),
    periodicidad_ingresos:  new FormControl(null),
    color_casa:             new FormControl(null),
    color_porton:           new FormControl(null),
    niveles_casa:           new FormControl(null),
    parentesco_contacto1:   new FormControl(null),
    parentesco_contacto2:   new FormControl(null),
    nombre_contacto1:       new FormControl(null),
    nombre_contacto2:       new FormControl(null),
    telefono_contacto1:     new FormControl(null),
    telefono_contacto2:     new FormControl(null),
    direccion_contacto1:    new FormControl(null),
    direccion_contacto2:    new FormControl(null),
    ingreso_mensual:        new FormControl(null),
    tiempo_vivienda_años:   new FormControl(null),
    tiempo_vivienda_meses:  new FormControl(null),
    observaciones_negocio:  new FormControl(null),
    tiempo_empleo_años:     new FormControl(null),
    tiempo_empleo_meses:    new FormControl(null),
    sucursal_id:            new FormControl(null),
    zona_id:                new FormControl(null, [Validators.required]),
    agencia_id:             new FormControl(null, [Validators.required]),
    fecha_solicitud:        new FormControl(null, [Validators.required]),
    fecha_creacion:         new FormControl(null),
    observaciones:          new FormControl(null),
    cliente: new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido_paterno: new FormControl(null, [Validators.required]),
      apellido_materno: new FormControl(null),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      sexo: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      rfc: new FormControl(null),
      curp: new FormControl(null),
      email: new FormControl(null),
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
    aval: new FormGroup({
      nombre:           new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      apellido_paterno: new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      apellido_materno: new FormControl(null, this.formularioMicroNegocioIsRequired ? [] : []),
      fecha_nacimiento: new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      telefono:         new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      calle:            new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      colonia_id:       new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      num_ext:          new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
    }),
    negocio: new FormGroup({
      nombre:           new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      giro:             new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      telefono:         new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      calle:            new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      colonia_id:       new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      num_ext:          new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
      hora_pago:        new FormControl(null, this.formularioMicroNegocioIsRequired ? [Validators.required] : []),
    }),
    personas_viviendo: new FormControl(null),
    num_dependientes: new FormControl(null),
    vivienda: new FormControl(null),
    vivienda_otra: new FormControl(null),
    colonia_id: new FormControl(null),
    dependientes: this.fb.array([]),
  });

  constructor(
    private pathService: PathService,
    private sucursalService: SucursalesService,
    private zonaService: ZonasService,
    private agenciaService: AgenciasService,
    private montoService: MontosService,
    private tarifaService: TarifasService,
    private clienteService: ClientesService,
    private coloniaService: ColoniasService,
    private estadoService: EstadosService,
    private ocupacionService: OcupacionesService,
    private parentescoService: ParentescosService,
    private tipoEmpleoService: TipoEmpleoService,
    private tipoIdentificacionService: TipoIdentificacionService,
    private solicitudService: SolicitudesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private config: NgSelectConfig
  ) {

    this.config.notFoundText = 'No se encontraron elementos';

    this.items$ = this.input$.pipe(
      map((term) => this.searchCliente(term))
    );

    this.fechaHoy = new Date();

    this.solicitudForm.setValue({
      id: null,
      cliente_id: null,
      tipo_solicitud: 1,
      monto: null,
      tarifa_id: null,
      estatus_sol_id: 1,  //ABIERTA
      fecha_creacion: null,
      fecha_solicitud: this.formatFecha(this.fechaHoy),
      observaciones: null,
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
      sucursal_id: 1,
      zona_id: null,
      agencia_id: null,
      dependientes: [],
      vivienda: 'VIVIENDA PROPIA',
      vivienda_otra: null,
      ingreso_mensual: null,
      num_dependientes: null,
      personas_viviendo: null,
      cliente: {
        nombre: null,
        apellido_paterno: null,
        apellido_materno: null,
        fecha_nacimiento: null,
        sexo: null,
        telefono: null,
        rfc: null,
        curp: null,
        email: ('Sin especificar'),
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
      aval: {
        nombre: null,
        apellido_paterno: null,
        apellido_materno: null,
        fecha_nacimiento: null,
        telefono: null,
        calle: null,
        colonia_id: null,
        num_ext: null,
      },
      negocio: {
        nombre: null,
        giro: null,
        telefono: null,
        calle: null,
        colonia_id: null,
        num_ext: null,
        hora_pago:null,
      },
      colonia_id: null,

    });

    this.solicitudForm.controls['vivienda_otra'].disable();
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

    this.zonaService.getZonas().subscribe( res=>{
      //empezamos precargando las zonas de la sucursal 1
      this.zonas = res.filter(item => item.sucursal_id === 1)
    });

    //Llenamos la solicitud si existen parametros
    this.route.params.subscribe(params => {

      if (params.id) {

        this.solicitudService.getSolicitud(params.id).subscribe((res: any) => {

          this.editingSolicitud = res;

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

          //Datos de la Solilcitud
          this.populateSolicitudFields(res);

          //Datos del Cliente/Solicitante
          this.populateClienteFields(res);

          //Activamos el input si la vivienda_otra
          if (this.vivienda_otra.value != null) {
            this.solicitudForm.controls['vivienda_otra'].enable();
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
    //this.loadMontos();
    this.loadClientes();
    this.loadColonias();
    this.loadEstados();
    this.loadOcupaciones();
    this.loadParentescos();
    this.loadTipoEmpleo();
    this.loadTipoIdentificacion();
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
    this.tarifaService.getTarifasActivas().subscribe(res => {

      this.tarifas = res;
    })
  }

  // loadMontos() {
  //   this.montoService.getMontos().subscribe((montos: any) => {
  //     this.montos = montos;
  //   })
  // }

  loadClientes() {

    this.clienteService.getClientesLimitados(this.busqueda).subscribe(clientes=>{

      this.clientesArray = clientes.clientesJSON;

    })

  }

  buscarElementos(terminoBusqueda: any) {

    this.busqueda = terminoBusqueda.term;

    this.loadClientes();

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

  onChangeSucursal(event: any) {

    if (event) {

      this.zonas = Array.from(this.zonasArray).filter(zona =>
        zona.sucursal_id == event.id
      );
    }


    if (this.zonas.length < 0) {
    } else {
      //Remueve default values del ng-select cuando no hay res
      //this.selectZona.handleClearClick();
      this.selectZona.clearModel();
      this.selectAgencia.clearModel();
      this.onChangeZona(44444444); //Resetea el evento
    }

  }

  onChangeZona(event: any) {

    if (event?.id) {

      this.agencias = Array.from(this.agenciasArray).filter(agencia =>
        agencia.zona_id === event.id
      )

      if (this.agencias.length < 0) {
      } else {
        this.selectAgencia.clearModel();
      }
    }
  }

  // onChangeMonto(event: any) {

  //   if (event) {
  //     this.tarifa_id.setValue(event.id);
  //   }
  // }

  onChangeTarifa(event: any) {
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

      this.clienteSelected = this.clientesArray.filter(cliente => cliente.id === event.id);

      this.populateClienteFields(this.clienteSelected[0]);

      //preguntamos si el cliente tiene solicitudes previamente llenadas
      //llamamos a un metodo que llene las solicitud si existe
      this.solicitudService.getSolicitudesByClienteId(this.clienteSelected[0].id).subscribe(solicitud => {
        if (solicitud) {

          let zona = {
            id: solicitud.sucursal_id
          }

          let agencia = {
            id: solicitud.zona_id
          }

          //this.onChangeSucursal(zona);
          //this.onChangeZona(agencia);

          this.populateSolicitudFields(solicitud);

          //Sobreescribimos los campos de las direcciones en base a la solicitud anterior
          this.cliente.get('calle')?.setValue(solicitud.calle);
          this.cliente.get('num_ext')?.setValue(solicitud.num_ext);
          this.cliente.get('num_int')?.setValue(solicitud.num_int);
          this.cliente.get('cruzamientos')?.setValue(solicitud.cruzamientos);
          this.cliente.get('referencia')?.setValue(solicitud.referencia);
          this.cliente.get('colonia_id')?.setValue(solicitud.colonia_id);
          this.cliente.get('municipio')?.setValue(solicitud.municipio);
          this.cliente.get('localidad')?.setValue(solicitud.localidad);
          this.cliente.get('estado')?.setValue(solicitud.estado);


        }
      });

    }

  }

  onChangeCheckServicesAll(event: any) {

    if (event.target) {
      this.selectChecks(event.target.checked);
    }
  }

  onChangeTipoSolicitud(event: any) {

    this.formularioMicroNegocioIsRequired = event.nombre === 'MICRONEGOCIO'

    //const avalFormGroup = this.solicitudForm.get('aval') as FormGroup;

    const camposAvalFormGroup = ['nombre','apellido_paterno','fecha_nacimiento','telefono','calle','num_ext','colonia_id'];
    const camposNegocioFormGroup = ['nombre','giro','telefono','calle','num_ext','colonia_id','hora_pago'];

    camposAvalFormGroup.forEach((campo)=> {

      const formControl = this.avalForm.get(campo);

      if(formControl){
        if(this.formularioMicroNegocioIsRequired){
          formControl.setValidators([Validators.required]);
        }else{
          formControl.clearValidators();
          formControl.reset();
        }

        formControl.updateValueAndValidity(); //Actualizamos los Validadores
      }

    })

    camposNegocioFormGroup.forEach((campo)=> {

      const formControl = this.negocioForm.get(campo);

      if(formControl){
        if(this.formularioMicroNegocioIsRequired){
          formControl.setValidators([Validators.required]);
        }else{
          formControl.clearValidators();
          formControl.reset();
        }

        formControl.updateValueAndValidity(); //Actualizamos los Validadores
      }

    })

  }

  selectChecks(flag: Boolean) {

    this.servicios.get('luz')?.setValue(flag);
    this.servicios.get('agua_potable')?.setValue(flag);
    this.servicios.get('auto_propio')?.setValue(flag);
    this.servicios.get('telefono_fijo')?.setValue(flag);
    this.servicios.get('telefono_movil')?.setValue(flag);
    this.servicios.get('refrigerador')?.setValue(flag);
    this.servicios.get('estufa')?.setValue(flag);
    this.servicios.get('internet')?.setValue(flag);
    this.servicios.get('gas')?.setValue(flag);
    this.servicios.get('tv')?.setValue(flag);
    this.servicios.get('alumbrado_publico')?.setValue(flag);
  }

  populateClienteFields(data: Cliente) {

    this.cliente_id?.setValue(data.id);

    this.cliente.get('nombre')?.setValue(data.nombre);
    this.cliente.get('apellido_paterno')?.setValue(data.apellido_paterno);
    this.cliente.get('apellido_materno')?.setValue(data.apellido_materno);
    this.cliente.get('fecha_nacimiento')?.setValue(this.formatFecha(data.fecha_nacimiento));
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

    //Procedemos  llenar los selects de sucursal, zona y agencia al que pertenece el cliente

    this.zona_id?.setValue(data.zona_id);
    
    this.agenciaService.getAgencias().subscribe( (res:any) =>{
      this.agencias = res.filter(item => item.zona_id === data.zona_id );
    });

    this.agencia_id?.setValue(data.agencia_id);

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

    //this.fecha_solicitud?.setValue(this.formatFecha(data.fecha_solicitud));
    this.monto?.setValue(data.monto);
    this.tarifa_id?.setValue(data.tarifa_id);
    this.vivienda?.setValue(data.vivienda);
    this.vivienda_otra?.setValue(data.vivienda_otra);
    this.tiempo_vivienda_años?.setValue(data.tiempo_vivienda_años);
    this.tiempo_vivienda_meses?.setValue(data.tiempo_vivienda_meses);
    this.tiempo_empleo_años?.setValue(data.tiempo_empleo_años);
    this.tiempo_empleo_meses?.setValue(data.tiempo_empleo_meses);
    this.observaciones_negocio?.setValue(data.observaciones_negocio);
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
    this.observaciones?.setValue(data.observaciones);

    //Servicios
    this.servicios.get('luz')?.setValue(data.solicitudServicio?.luz);
    this.servicios.get('agua_potable')?.setValue(data.solicitudServicio?.agua_potable);
    this.servicios.get('auto_propio')?.setValue(data.solicitudServicio?.auto_propio);
    this.servicios.get('telefono_fijo')?.setValue(data.solicitudServicio?.telefono_fijo);
    this.servicios.get('telefono_movil')?.setValue(data.solicitudServicio?.telefono_movil);
    this.servicios.get('refrigerador')?.setValue(data.solicitudServicio?.refrigerador);
    this.servicios.get('estufa')?.setValue(data.solicitudServicio?.estufa);
    this.servicios.get('internet')?.setValue(data.solicitudServicio?.internet);
    this.servicios.get('gas')?.setValue(data.solicitudServicio?.gas);
    this.servicios.get('tv')?.setValue(data.solicitudServicio?.tv);
    this.servicios.get('alumbrado_publico')?.setValue(data.solicitudServicio?.alumbrado_publico);
  }

  onClearCliente() {

    this.cliente.reset();
    this.cliente_id.reset();
    this.monto.reset();
    this.selectTarifa?.clearModel();
    this.selectAgencia.clearModel();
    this.cp.nativeElement.value = null;

    this.clearData();

  }

  onClearMonto(){
    this.selectTarifa?.clearModel();
  }

  clearData(){
    this.solicitudForm.reset();

    this.sucursal_id.setValue(1);
    this.vivienda.setValue('VIVIENDA PROPIA');
    this.fecha_solicitud.setValue(this.formatFecha(this.fechaHoy));
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

  saveSolicitud() {

    this.submitted = true;

    if (this.solicitudForm.valid) {

      console.log('Formulario Valido');

      if (this.solicitudForm.value.id != null) {

        //En este componente las solicitudes no se pueden editar, siempre se va a crear una nueva
        //this.solicitudService.updateSolicitud(this.solicitudForm.value).subscribe((res: any) => {
        this.solicitudService.insertSolicitud(this.solicitudForm.value).subscribe((res: any) => {

          this.toastr.success(res);

          this.router.navigateByUrl('/dashboard/solicitudes');
        })

      } else {


        // this.solicitudService.insertSolicitud(this.solicitudForm.value).subscribe((res: any) => {
        //   this.toastr.success(res);

        //   this.router.navigateByUrl('/dashboard/solicitudes');

        // }, ({ error }) => {
        //   this.toastr.error(error.errors[0]['msg']);
        // });

      }

    } else {

      this.toastr.error('Formulario no valido');
    }
  }

  changeStatus() {

    Swal.fire({
      title: 'Enviar a revisión',
      html: `¿Está ud. seguro que desea enviar a revisión la solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si!, Enviar',
      confirmButtonAriaLabel: 'send'
    }).then((result) => {
      if (result.isConfirmed) {

        this.estatus_sol_id?.setValue(3);
        this.saveSolicitud();

      }
    });

  }

  //Este codigo es el que hace que no se me desplieguen todos los clientes
  searchCliente(term:any) {

    if(term === null || term.length < 1 ) return term;

  }

  volver() {
    this.router.navigate(['/dashboard/solicitudes'])
  }

  setPath() {
    this.pathService.path = '/dashboard/solicitudes';
  }

  //Getters

  //Formularios
  get cliente() {
    return this.solicitudForm.get('cliente') as FormGroup;
  }

  get servicios() {
    return this.solicitudForm.get('servicios') as FormGroup;
  }

  get avalForm() {
    return this.solicitudForm.get('aval') as FormGroup;
  }

  get negocioForm() {
    return this.solicitudForm.get('negocio') as FormGroup;
  }

  ///

  get id() {
    return this.solicitudForm.get('id');
  }

  get tipo_solicitud() {
    return this.solicitudForm.get('tipo_solicitud');
  }

  get fecha_solicitud() {
    return this.solicitudForm.get('fecha_solicitud');
  }

  get estatus_sol_id() {
    return this.solicitudForm.get('estatus_sol_id');
  }

  get colonia_id() {
    return this.cliente.get('colonia_id');
  }

  get nombre() {
    return this.cliente.get('nombre');
  }

  get sexo() {
    return this.cliente.get('sexo');
  }

  get telefono() {
    return this.cliente.get('telefono');
  }

  get apellido_paterno() {
    return this.cliente.get('apellido_paterno');
  }

  get fecha_nacimiento() {
    return this.cliente.get('fecha_nacimiento');
  }

  get num_ext() {
    return this.cliente.get('num_ext');
  }

  get calle() {
    return this.cliente.get('calle');
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

  //AVAL

  get aval_nombre(){
    return this.avalForm.get('nombre');
  }

  get aval_apellido_paterno(){
    return this.avalForm.get('apellido_paterno');
  }

  get aval_apellido_materno(){
    return this.avalForm.get('apellido_materno');
  }

  get aval_fecha_nacimiento(){
    return this.avalForm.get('fecha_nacimiento');
  }

  get aval_telefono(){
    return this.avalForm.get('telefono');
  }

  get aval_calle(){
    return this.avalForm.get('calle');
  }

  get aval_num_ext(){
    return this.avalForm.get('num_ext');
  }

  get aval_colonia_id(){
    return this.avalForm.get('colonia_id');
  }

  //NEGOCIO

  get negocio_nombre(){
    return this.negocioForm.get('nombre');
  }

  get negocio_giro(){
    return this.negocioForm.get('giro');
  }

  get negocio_telefono(){
    return this.negocioForm.get('telefono');
  }

  get negocio_calle(){
    return this.negocioForm.get('calle');
  }

  get negocio_num_ext(){
    return this.negocioForm.get('num_ext');
  }

  get negocio_colonia_id(){
    return this.negocioForm.get('colonia_id');
  }

  get negocio_hora_pago(){
    return this.negocioForm.get('hora_pago');
  }

  //

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

  get cruzamientos() {
    return this.solicitudForm.get('cruzamientos');
  }

  get referencia() {
    return this.solicitudForm.get('referencia');
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

  get tiempo_empleo_años() {
    return this.solicitudForm.get('tiempo_empleo_años');
  }

  get tiempo_empleo_meses() {
    return this.solicitudForm.get('tiempo_empleo_meses');
  }

  get observaciones_negocio() {
    return this.solicitudForm.get('observaciones_negocio');
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

}
