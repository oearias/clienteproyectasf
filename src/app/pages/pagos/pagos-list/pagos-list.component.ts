import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { PagosService } from 'src/app/services/pagos.service';
import { Pago } from '../../../interfaces/Pago';

@Component({
  selector: 'app-pagos-list',
  templateUrl: './pagos-list.component.html',
  styleUrls: ['./pagos-list.component.css']
})
export class PagosListComponent implements OnInit {

  pagos: Pago[] = [];
  p: number = 1;
  itemsPP: number = 10;
  subscription: Subscription;
  selectedItem = this.itemsPP;
  palabra:any

  criterio: any;

  items = [
    { cant: 20 },
    { cant: 30 },
    { cant: 40 },
    { cant: 50 },
  ]

  criterios = [
    { nombre: 'crédito', criterio: 'credito_id' },
    { nombre: 'folio', criterio: 'folio' },
    { nombre: 'nombre', criterio: 'nombre' },
  ];

  //Sort
  key = 'id';
  reverse: boolean = false;

  constructor(
    private pagoService: PagosService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getPagos();

    this.subscription = this.pagoService.refresh$.subscribe(() => {
      this.getPagos();
    });
  }

  getPagos() {
    this.pagoService.getPagos().subscribe((res: Pago[]) => {
      
      //Con este tratamiento convertimos el monto a tipo number
      res.map(pago =>{
        pago.monto = Number(pago.monto)
        return pago;
      })


      this.pagos = res;

    });
  }

  createPago() {
    this.router.navigateByUrl('dashboard/pagos/pago');
  }

  editPago(pago: Pago) {
    this.router.navigate(['dashboard/pagos/pago', pago.id]);
  }

  viewPago(pago: Pago) {
    this.router.navigate(['dashboard/pagos/pago/view', pago.id]);
  }

  deletePago(pago: Pago){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar <br>el pago
      con folio <b>${pago.folio}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.pagoService.deletePago(pago).subscribe( (res:any) => {
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

  cambiaItems(event:any) {
    this.itemsPP = event.cant
  }

  getCriterio(event:any) {
    this.criterio = event.criterio
  }

  search() {

    if(this.criterio!= null && this.palabra!=null){
      this.pagoService.getPagosByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.pagos = res;
      })
    }
  }

  limpiar(){
    this.criterio=null;
    this.palabra=null;
    this.ngOnInit();
  }

  sort(key:string){

    console.log(key);

    this.key = key;
    this.reverse = !this.reverse;
  }

}
