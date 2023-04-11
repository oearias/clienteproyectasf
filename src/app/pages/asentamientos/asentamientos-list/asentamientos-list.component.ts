import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TipoAsentamiento } from '../../../interfaces/TipoAsentamiento';
import { TipoAsentamientoService } from '../../../services/tipo-asentamiento.service';
import { ModalService } from '../../../services/modal.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-asentamientos-list',
  templateUrl: './asentamientos-list.component.html',
  styleUrls: ['./asentamientos-list.component.css']
})
export class AsentamientosListComponent implements OnInit {

  tipoAsentamientos: TipoAsentamiento[] = [];
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
    { nombre: 'abreviatura', criterio: 'abreviatura' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private tipoAsentamientoService: TipoAsentamientoService,
    private modalService: ModalService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTipoAsentamientos();

    this.subscription = this.tipoAsentamientoService.refresh$.subscribe(() => {
      this.getTipoAsentamientos();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getTipoAsentamientos();
    });
  }

  getTipoAsentamientos() {
    this.tipoAsentamientoService.getTipoAsentamientos().subscribe((res: any) => {

      this.tipoAsentamientos = res;

    });
  }

  createTipoAsentamiento() {
    this.router.navigateByUrl('catalogos/asentamientos/asentamiento');
  }

  editTipoAsentamiento(ta: TipoAsentamiento) {
    this.router.navigate(['catalogos/asentamientos/asentamiento', ta.id]);
  }

  deleteTipoAsentamiento(ta: TipoAsentamiento){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${ta.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tipoAsentamientoService.deleteTipoAsentamiento(ta).subscribe( (res:any) => {
          if(res){

            // Swal.fire(
            //   '¡Eliminado!',
            //   'El registro ha sido eliminado',
            //   'success'
            // );
            this.toastr.success(res);

          }
        })

        
      }
    });

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  getCriterio(event) {
    this.criterio = event.criterio
  }

  search() {

    if(this.criterio!= null && this.palabra!=null){
      this.tipoAsentamientoService.getTipoAsentamientoByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.tipoAsentamientos = res;
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
