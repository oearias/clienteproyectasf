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

  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto
  
  busqueda = '';
  
  subscription: Subscription;

 

  constructor(
    private creditoService: CreditosService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.getInversiones(this.currentPage);

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getInversiones(this.currentPage);
    });
    
  }

  getInversiones(page: number, limit: number = 10) {
    
    this.creditoService.getCreditosInversionPositiva(page, limit, this.busqueda).subscribe((res) => {

      this.creditos = res.creditosJSON;
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage;

    });
  }

  generatePageRange(): number[] {

    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.getInversiones(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getInversiones(1);

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



}
