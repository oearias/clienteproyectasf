import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from '../../../services/sucursales.service';
import { EstadosService } from '../../../services/estados.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Cliente } from '../../../interfaces/Cliente';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../../services/clientes.service';
import { ColoniasService } from '../../../services/colonias.service';
import { PathService } from '../../../services/path.service';
import { ZonasService } from '../../../services/zonas.service';
import { AgenciasService } from '../../../services/agencias.service';
import { Agencia } from 'src/app/interfaces/Agencia';
import { Zona } from 'src/app/interfaces/Zona';
import { NgSelectComponent } from '@ng-select/ng-select';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  @ViewChild('selectSucursal') selectSucursal: NgSelectComponent;
  @ViewChild('selectZona') selectZona: NgSelectComponent;
  @ViewChild('selectAgencia') selectAgencia: NgSelectComponent;
  @ViewChild('cp') cp: ElementRef;

  sucursales: any = [];
  zonas: any = [];
  agencias: any = [];
  estados: any = [];
  colonias: any = [];

  agenciasArray: Agencia[] = [];
  zonasArray: Zona[] = [];
  
  arrSexo: any[] = [
    { nombre: 'FEMENINO' },
    { nombre: 'MASCULINO' }
  ];

  clienteForm = this.fb.group({
    id:               new FormControl(null),
    sucursal_id:      new FormControl(null, Validators.required),
    zona_id:          new FormControl(null, Validators.required),
    agencia_id:       new FormControl(null, Validators.required),
    nombre:           new FormControl(null, [Validators.required]),
    apellido_paterno: new FormControl(null, [Validators.required]),
    apellido_materno: new FormControl(null),
    fecha_nacimiento: new FormControl(null, [Validators.required]),
    sexo:             new FormControl(null, [Validators.required]),
    telefono:         new FormControl(null, [Validators.required]),
    curp:             new FormControl(null,),
    rfc:              new FormControl(null,),
    email:            new FormControl(null,),
    calle:            new FormControl(null, [Validators.required]),
    colonia_id:       new FormControl(null, [Validators.required]),
    num_ext:          new FormControl(null, [Validators.required]),
    num_int:          new FormControl(null),
    cruzamientos:     new FormControl(null),
    referencia:       new FormControl(null),
    municipio:        new FormControl(null, [Validators.required]),
    localidad:        new FormControl(null, [Validators.required]),
    estado:           new FormControl(null, [Validators.required]),
  });

  editingCliente: Cliente;

  constructor(
    private pathService: PathService,
    private clienteService: ClientesService,
    private sucursalService: SucursalesService,
    private zonaService: ZonasService,
    private agenciaService: AgenciasService,
    private estadosService: EstadosService,
    private coloniaService: ColoniasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm.setValue({
      id: null,
      sucursal_id: 1,
      zona_id:null, //Valores por default
      agencia_id:null,
      nombre: null,
      apellido_paterno: null,
      apellido_materno: null,
      fecha_nacimiento: null,
      sexo: null,
      telefono: null,
      curp: null,
      rfc: null,
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
    });

  }

  ngOnInit(): void {
    
    this.setPath();

    this.loadData();

    this.route.params.subscribe((params) => {

      if (params.id) {

        //Averiguar que es mejor, si pasar los parametros por url o por una nueva consulta.
        this.clienteService.getCliente(params.id).subscribe(res => {
          this.editingCliente = res;

          let fecha = this.formatFecha(res.fecha_nacimiento);

          this.id?.setValue(this.editingCliente.id);
          this.sucursal_id?.setValue(this.editingCliente.sucursal_id);
          this.zona_id?.setValue(this.editingCliente.zona_id);
          
          this.nombre?.setValue(this.editingCliente.nombre);
          this.apellido_paterno?.setValue(this.editingCliente.apellido_paterno);
          this.apellido_materno?.setValue(this.editingCliente.apellido_materno);
          this.colonia_id?.setValue(this.editingCliente.colonia_id);
          this.fecha_nacimiento?.setValue(fecha);
          this.sexo?.setValue(this.editingCliente.sexo);
          this.telefono?.setValue(this.editingCliente.telefono);
          this.curp?.setValue(this.editingCliente.curp);
          this.rfc.setValue(this.editingCliente.rfc);
          this.email?.setValue(this.editingCliente.email);
          this.calle?.setValue(this.editingCliente.calle);
          this.num_ext?.setValue(this.editingCliente.num_ext);
          this.num_int?.setValue(this.editingCliente.num_int);
          this.cruzamientos?.setValue(this.editingCliente.cruzamientos);
          this.referencia?.setValue(this.editingCliente.referencia);
          this.num_int?.setValue(this.editingCliente.municipio);

          //Change cp
          this.onEditColonia(this.editingCliente.cp)

          const event = {
            id: this.editingCliente.zona_id
          }

          this.onChangeZona(event);

          

          this.agenciaService.getAgencias().subscribe( (res:any) =>{
            this.agencias = res.filter(item => item.zona_id === this.editingCliente.zona_id );
          });

          this.agencia_id?.setValue(this.editingCliente.agencia_id);

        });

      }
    });

    this.zonaService.getZonas().subscribe( res=>{
      //empezamos precargando las zonas de la sucursal 1
      this.zonas = res.filter(item => item.sucursal_id === 1)
    });

  }

  loadData(){

    this.getSucursales();
    this.loadZonas();
    this.getAgencias();

    this.getEstados();
    this.getColonias();
  }

  getSucursales() {
    this.sucursalService.getSucursales().subscribe(res => {
      this.sucursales = res;
    })
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
      this.selectZona?.clearModel();
      this.selectAgencia?.clearModel();
      this.onChangeZona(444); //Resetea el evento
    }

  }

  loadZonas() {

    this.zonaService.getZonas().subscribe((res:any) => {
      this.zonasArray = res;
    });

  }

  getAgencias() {
    this.agenciaService.getAgencias().subscribe( (res:any) => {
      this.agenciasArray = res;
    })
  }

  getEstados() {
    this.estadosService.getEstados().subscribe(res => {
      this.estados = res;
    });
  }

  getColonias() {
    this.coloniaService.getColonias().subscribe(res => {
      this.colonias = res;
    })
  }

  saveCliente() {

    if (this.clienteForm.valid) {

      if (this.clienteForm.value.id != null) {

        this.clienteService.updateCliente(this.clienteForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });

      } else {

        this.clienteService.insertCliente(this.clienteForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        }, (err) => {

          if(err.error.errors){
            this.toastr.error(err.error.errors[0].param);
            return;
          }

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/dashboard/clientes');

    } else {
      this.toastr.error('Formulario no valido');
    }
  }

  onChangeColonia(event) {

    if (event.cp) {
      this.cp.nativeElement.value = event.cp;
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

  onEditColonia(cp:number) {

    if (cp) {
      this.cp.nativeElement.value = cp;
    }
  }

  volver() {
    this.router.navigate(['/dashboard/clientes']);
  }

  setPath(){
    this.pathService.path = '/dashboard/clientes';
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

  //Getters
  get id() {
    return this.clienteForm.get('id');
  }

  get sucursal_id() {
    return this.clienteForm.get('sucursal_id');
  }

  get zona_id() {
    return this.clienteForm.get('zona_id');
  }

  get agencia_id() {
    return this.clienteForm.get('agencia_id');
  }

  get nombre() {
    return this.clienteForm.get('nombre');
  }

  get apellido_paterno() {
    return this.clienteForm.get('apellido_paterno');
  }

  get apellido_materno() {
    return this.clienteForm.get('apellido_materno');
  }

  get fecha_nacimiento() {
    return this.clienteForm.get('fecha_nacimiento');
  }

  get telefono() {
    return this.clienteForm.get('telefono');
  }

  get sexo() {
    return this.clienteForm.get('sexo');
  }

  get curp() {
    return this.clienteForm.get('curp');
  }

  get rfc() {
    return this.clienteForm.get('rfc');
  }

  get email() {
    return this.clienteForm.get('email');
  }

  get calle() {
    return this.clienteForm.get('calle');
  }

  get colonia_id() {
    return this.clienteForm.get('colonia_id');
  }

  get num_ext() {
    return this.clienteForm.get('num_ext');
  }

  get num_int() {
    return this.clienteForm.get('num_int');
  }

  get cruzamientos() {
    return this.clienteForm.get('cruzamientos');
  }

  get referencia() {
    return this.clienteForm.get('referencia');
  }

  get municipio() {
    return this.clienteForm.get('municipio');
  }

  get localidad() {
    return this.clienteForm.get('localidad');
  }

  get estado() {
    return this.clienteForm.get('estado');
  }

}
