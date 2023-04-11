import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TipoIdentificacion } from 'src/app/interfaces/TipoIdentificacion';
import { ModalService } from 'src/app/services/modal.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-identificaciones-list',
  templateUrl: './identificaciones-list.component.html',
  styleUrls: ['./identificaciones-list.component.css']
})
export class IdentificacionesListComponent implements OnInit {

  tipoIdentificaciones: TipoIdentificacion[] = [];
  p: number = 1;
  itemsPP: number = 10;
  subscription: Subscription;
  selectedItem = this.itemsPP;
  palabra:any

  criterio: any;

  items = [
    { cant: 5 },
    { cant: 10 },
    { cant: 15 },
    { cant: 20 },
    { cant: 25 },
  ]

  criterios = [
    { nombre: 'nombre', criterio: 'nombre' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private tipoIdentificacionService: TipoIdentificacionService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTipoIdentificaciones();

    this.subscription = this.tipoIdentificacionService.refresh$.subscribe(() => {
      this.getTipoIdentificaciones();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getTipoIdentificaciones();
    });
  }

  getTipoIdentificaciones() {
    this.tipoIdentificacionService.getTipoIdentificaciones().subscribe((res: any) => {

      this.tipoIdentificaciones = res;

    });
  }

  createTipoIdentificacion() {
    this.router.navigateByUrl('catalogos/identificaciones/identificacion');
  }

  editTipoIdentificacion(ti: TipoIdentificacion) {
    this.router.navigate(['catalogos/identificaciones/identificacion', ti.id]);
  }

  deleteTipoIdentificacion(ti: TipoIdentificacion){
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${ti.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tipoIdentificacionService.deleteTipoIdentificacion(ti).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        })

        
      }
    });
  }

  showModal(ti: TipoIdentificacion) {

    this.modalService.showModal = true;
    this.modalService.registro = `${ti.nombre}`
    this.modalService.id = ti.id;
    this.modalService.path = 'tipos/identificacion/';

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  getCriterio(event) {
    this.criterio = event.criterio
  }

  search() {

    if(this.criterio!= null && this.palabra!=null){
      this.tipoIdentificacionService.getTipoIdentificacionesByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.tipoIdentificaciones = res;
      })
    }
  }

  limpiar(){
    this.criterio=null;
    this.palabra=null;
    this.ngOnInit();
  }

  sort(key:string){
    this.key = key;
    this.reverse = !this.reverse;
  }

}
