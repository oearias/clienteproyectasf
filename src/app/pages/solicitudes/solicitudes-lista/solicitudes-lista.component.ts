import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Solicitud } from '../../../interfaces/Solicitud';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SolEstatusService } from '../../../services/sol-estatus.service';
import { EstatusSolicitud } from '../../../interfaces/EstatusSolicitud';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-solicitudes-lista',
  templateUrl: './solicitudes-lista.component.html',
  styleUrls: ['./solicitudes-lista.component.css']
})
export class SolicitudesListaComponent implements OnInit {

  @ViewChild('selectEstatus') selectEstatus: NgSelectComponent;
  @ViewChild('inputAux') inputAux: ElementRef;

  solicitudes: Solicitud[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required),
  })

  subscription: Subscription;

  //Paginate
  p: number = 1;
  itemsPP: number = 10;
  selectedItem = this.itemsPP;
  items = [
    { cant: 5 },
    { cant: 10 },
    { cant: 15 },
    { cant: 20 },
    { cant: 25 },
  ];

  role:any;

  //Filter
  criterios = [
    { nombre: 'nombre', criterio: 'nombre' },
    { nombre: 'apellido paterno', criterio: 'apellido_paterno' },
    { nombre: 'apellido materno', criterio: 'apellido_materno' },
    { nombre: 'número de cliente', criterio: 'num_cliente' },
    { nombre: 'número de solicitud', criterio: 'sol_id' },
    { nombre: 'estatus', criterio: 'estatus_id' },
  ];

  //Estatus
  estatus: EstatusSolicitud[] = [];
 
  //Sort
  //key = 'id';
  key = '';
  reverse: boolean = false;

  allowedRoles = ['CREATOR', 'ADMIN'];

  constructor(
    private router: Router,
    private solService: SolicitudesService,
    private solEstatusService: SolEstatusService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { 
    this.role = localStorage.getItem('role');
  }

  ngOnInit(): void {

    this.loadEstatusSolicitud();
    this.getSolicitudes();

    this.subscription = this.solService.refresh$.subscribe(() => {
      this.getSolicitudes();
    });

  }

  getSolicitudes() {
    this.solService.getSolicitudes().subscribe((res: any) => {

      if(this.role === 'EDITOR'){

        this.solicitudes = res.filter( (solicitud:Solicitud)=> solicitud.estatus_sol_id === 3 );

      }else{

        this.solicitudes = res;
      }


    });

  }

  createSolicitud() {
    this.router.navigateByUrl('dashboard/solicitudes/solicitud');
  }

  editSolicitud(solicitud: Solicitud) {
    this.router.navigate(['dashboard/solicitudes/solicitud', solicitud.id, 'flagEdit',true]);
  }

  deleteSolicitud(solicitud: Solicitud){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar <br>la solicitud <b>${solicitud.id}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.solService.deleteSolicitud(solicitud).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        }, (err) => {

          Swal.fire({
            title:'¡Ups!',
            html:`No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
            icon:'warning'
          });
        });

      }
    });
  }

  viewSolicitud(solicitud: Solicitud){
    this.router.navigate(['dashboard/solicitudes/solicitud/view', solicitud.id])
  }

  onChangeCriterio(event: any){
    if(event){

      this.inputAux.nativeElement.value = null;
      this.palabra.setValue(null);

      if(event.criterio === 'estatus_id'){

        this.selectEstatus.readonly = false;
        this.inputAux.nativeElement.disabled = true;

      }else{

        this.palabra.enable();
        this.inputAux.nativeElement.disabled = false;
        this.selectEstatus.handleClearClick();
        this.selectEstatus.readonly = true;

      }
    }
  }

  loadEstatusSolicitud(){
    this.solEstatusService.getEstatus().subscribe( estatusSol => {
      this.estatus = estatusSol
    });
  }

  onChangeSelectEstatus(event:any){
    if(event){
      this.palabra?.setValue(event?.id);
    }
  }

  onKeyUp(){
    this.palabra.setValue(this.inputAux.nativeElement.value);
  }

  cambiaItems(event:any) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.solService.getSolicitudesByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra).subscribe((res) => {
        this.solicitudes = res;
      }, err => {
        this.toastr.error(err.error.msg);
      })

    } else {
      this.toastr.error('Por favor llene todos los campos del filtro')
    }

  }

  goPresupuesto(){
    this.router.navigate(['dashboard/solicitudes/presupuesto']);
  }

  limpiar() {
    this.filterForm.reset();
    this.selectEstatus.clearModel();
    this.ngOnInit();
  }

  onClearSelectStatus(){
    this.palabra?.setValue(null);
  }

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  get criterio() {
    return this.filterForm.get('criterio');
  }

  get palabra() {
    return this.filterForm.get('palabra');
  }

}
