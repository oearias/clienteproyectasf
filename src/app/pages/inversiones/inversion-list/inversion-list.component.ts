import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Solicitud } from '../../../interfaces/Solicitud';
import Swal from 'sweetalert2';
import { CreditosService } from '../../../services/creditos.service';
import { Credito } from 'src/app/interfaces/Credito';

@Component({
  selector: 'app-inversion-list',
  templateUrl: './inversion-list.component.html',
  styleUrls: ['./inversion-list.component.css']
})
export class InversionListComponent implements OnInit {

  creditos: Credito[] = [];
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
    private creditoService: CreditosService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.getInversiones();

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getInversiones();
    });
  }

  getInversiones() {
    this.creditoService.getCreditos().subscribe((res: Credito[]) => {

      this.creditos = res.filter((credito: Credito) => {
        return credito.inversion_positiva === true;
      });

    });
  }

  createInversion() {
    this.router.navigateByUrl('dashboard/inversiones/inversion');
  }

  viewInversion(credito: Credito) {
    this.router.navigate(['dashboard/inversiones/inversion', credito.id]);
  }

  deleteInversion(credito: Credito){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro(a) de eliminar <br>la inversión positiva del
      crédito n. <b>${credito.num_contrato}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.creditoService.deleteInversionPositiva(credito).subscribe( (res:any) => {
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

  viewPago(solicitud: Solicitud) {
    this.router.navigate(['dashboard/pagos/pago/view', solicitud.id]);
  }

  // deletePago(solicitud: Solicitud){

  //   Swal.fire({
  //     title: 'Eliminar',
  //     html: `¿Está ud. seguro de eliminar <br>el pago
  //     con folio <b>${solicitud.id}</b>?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#2f5ade',
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonText: 'Eliminar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       this.solicitudService.deletePago(solicitud).subscribe( (res:any) => {
  //         if(res){

  //           this.toastr.success(res);

  //         }
  //       }, (err) => {

  //         Swal.fire({
  //           title:'¡Ups!',
  //           html:`No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
  //           icon:'warning'
  //         });
  //       });

  //     }
  //   });

  // }

  cambiaItems(event:any) {
    this.itemsPP = event.cant
  }

  getCriterio(event:any) {
    this.criterio = event.criterio
  }

  search() {

    if(this.criterio!= null && this.palabra!=null){
      this.creditoService.getCreditosByCriteria(this.criterio, this.palabra.toLocaleUpperCase() ).subscribe( res =>{
        this.creditos = res;
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
