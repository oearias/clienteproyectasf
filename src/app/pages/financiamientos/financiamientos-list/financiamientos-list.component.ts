import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Financiamiento } from '../../../interfaces/Financiamiento';
import { Subscription } from 'rxjs';
import { FinanciamientosService } from '../../../services/financiamientos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financiamientos-list',
  templateUrl: './financiamientos-list.component.html',
  styleUrls: ['./financiamientos-list.component.css']
})
export class FinanciamientosListComponent implements OnInit {

  financiamientos: Financiamiento[] = [];
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
    private financiamientoService: FinanciamientosService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getFinanciamientos();

    this.subscription = this.financiamientoService.refresh$.subscribe(() => {
      this.getFinanciamientos();
    });

  }

  getFinanciamientos() {
    this.financiamientoService.getFinanciamientos().subscribe((res: any) => {

      this.financiamientos = res;

    });
  }

  createFinanciamiento() {
    this.router.navigateByUrl('catalogos/financiamientos/financiamiento');
  }

  editFinanciamiento(financiamiento: Financiamiento) {
    this.router.navigate(['catalogos/financiamientos/financiamiento', financiamiento.id]);
  }

  deleteFinanciamiento(financiamiento: Financiamiento){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${financiamiento.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.financiamientoService.deleteFinanciamiento(financiamiento).subscribe( (res:any) => {
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
      this.financiamientoService.getFinanciamientoByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.financiamientos = res;
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
