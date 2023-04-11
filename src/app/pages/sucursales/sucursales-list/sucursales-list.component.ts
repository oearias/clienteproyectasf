import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sucursal } from '../../../interfaces/Sucursal';
import { ModalService } from '../../../services/modal.service';
import { SucursalesService } from '../../../services/sucursales.service';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sucursales-list',
  templateUrl: './sucursales-list.component.html',
  styleUrls: ['./sucursales-list.component.css']
})
export class SucursalesListComponent implements OnInit {

  sucursales: Sucursal[] = [];
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
  key = 'id';
  reverse: boolean = false;

  constructor(
    private sucursalService: SucursalesService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getSucursales();

    this.subscription = this.sucursalService.refresh$.subscribe(() => {
      this.getSucursales();
    });

  }

  getSucursales(){
    this.sucursalService.getSucursales().subscribe( (res:any) =>{
      this.sucursales = res;
    });
  }

  createSucursal() {
    this.router.navigateByUrl('catalogos/sucursales/sucursal');
  }

  editSucursal(sucursal: Sucursal) {
    this.router.navigate(['catalogos/sucursales/sucursal', sucursal.id]);
  }

  deleteSucursal(sucursal: Sucursal){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${sucursal.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.sucursalService.deleteSucursal(sucursal).subscribe( (res:any) => {
          if(res){

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
      this.sucursalService.getSucursalesByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.sucursales = res;
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
