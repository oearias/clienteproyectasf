import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Tarifa } from 'src/app/interfaces/Tarifa';
import { TarifasService } from '../../../services/tarifas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tarifas-list',
  templateUrl: './tarifas-list.component.html',
  styleUrls: ['./tarifas-list.component.css']
})
export class TarifasListComponent implements OnInit {

  tarifas: Tarifa[] = [];
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
    { nombre: 'clave', criterio: 'clave' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private tarifaService: TarifasService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTarifas();

    this.subscription = this.tarifaService.refresh$.subscribe(() => {
      this.getTarifas();
    });

  }

  getTarifas(){
    this.tarifaService.getTarifas().subscribe( (res:any) =>{
      this.tarifas = res;
    });
  }

  createTarifa() {
    this.router.navigateByUrl('catalogos/tarifas/tarifa');
  }

  editTarifa(tarifa: Tarifa) {
    this.router.navigate(['catalogos/tarifas/tarifa', tarifa.id]);
  }

  deleteTarifa(tarifa: Tarifa){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar la siguiente tarifa: <br><b>${tarifa.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tarifaService.deleteTarifa(tarifa).subscribe( (res:any) => {
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
      this.tarifaService.getTarifasByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.tarifas = res;
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
