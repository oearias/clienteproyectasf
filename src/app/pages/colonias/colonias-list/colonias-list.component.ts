import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ColoniasService } from '../../../services/colonias.service';
import { Colonia } from '../../../interfaces/Colonia';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-colonias-list',
  templateUrl: './colonias-list.component.html',
  styleUrls: ['./colonias-list.component.css']
})
export class ColoniasListComponent implements OnInit {

  colonias: Colonia[] = [];
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
    { nombre: 'código postal', criterio: 'cp' },
    { nombre: 'nombre', criterio: 'nombre' },
  ];

  //Sort
  key = 'id';
  reverse: boolean = false;

  constructor(
    private coloniaService: ColoniasService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getColonias();

    this.subscription = this.coloniaService.refresh$.subscribe(() => {
      this.getColonias();
    });

    // //Actualiza la lista despues de la acción del Modal
    // this.subscription = this.modalService.refresh$.subscribe(() => {
    //   this.getColonias();
    // });
  }


  getColonias() {
    this.coloniaService.getColonias().subscribe((res: any) => {

      this.colonias = res;

    });
  }

  createColonia() {
    this.router.navigateByUrl('catalogos/colonias/colonia');
  }

  editColonia(colonia: Colonia) {
    this.router.navigate(['catalogos/colonias/colonia', colonia.id]);
  }

  deleteColonia(colonia: Colonia){
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar la siguiente colonia: <br><b>${colonia.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.coloniaService.deleteColonia(colonia).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        }, (err) => {

          console.log(err);

          let tabla;

          if(err.error.tabla){
            tabla = err.error?.tabla
          }else{
            tabla = ''
          }

          Swal.fire({
            title:'¡Ups!',
            html:`No es posible eliminar el registro. ${err.error.msg} <b>${tabla}</b>`,
            icon:'warning'
          });
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
      this.coloniaService.getColoniasByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.colonias = res;
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
