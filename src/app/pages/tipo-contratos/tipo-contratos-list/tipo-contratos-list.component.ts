import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TipoContratoService } from 'src/app/services/tipo-contrato.service';
import { TipoContrato } from '../../../interfaces/TipoContrato';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-contratos-list',
  templateUrl: './tipo-contratos-list.component.html',
  styleUrls: ['./tipo-contratos-list.component.css']
})
export class TipoContratosListComponent implements OnInit {

  tipoContratos: TipoContrato[] = [];
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
    private tipoContratoService: TipoContratoService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTipoContratos();

    this.subscription = this.tipoContratoService.refresh$.subscribe(() => {
      this.getTipoContratos();
    });

  }

  getTipoContratos(){
    this.tipoContratoService.getTipoContratos().subscribe( (res:any) =>{
      this.tipoContratos = res;
    });
  }

  createTipoContrato() {
    this.router.navigateByUrl('catalogos/tipoContratos/tipoContrato');
  }

  editTipoContrato(tc: TipoContrato) {
    this.router.navigate(['catalogos/tipoContratos/tipoContrato', tc.id]);
  }

  deleteTipoContrato(tc: TipoContrato){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${tc.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tipoContratoService.deleteTipoContrato(tc).subscribe( (res:any) => {
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
      this.tipoContratoService.getTipoContratosByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.tipoContratos = res;
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
