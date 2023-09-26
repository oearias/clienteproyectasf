import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Pago } from 'src/app/interfaces/Pago';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-pagos-lista',
  templateUrl: './pagos-lista.component.html',
  styleUrls: ['./pagos-lista.component.css']
})
export class PagosListaComponent implements OnInit {

  constructor(
    private pagoService: PagosService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  pagos: Pago[] = [];

  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;

  ngOnInit(): void {

    this.getPagos(this.currentPage);

    this.subscription = this.pagoService.refresh$.subscribe(()=>{
      this.getPagos(this.currentPage);
    })

  }

  getPagos(page:number, limit: number = 10){

    this.pagoService.getPagosPaginados(page, limit, this.busqueda).subscribe((pagos) =>{

      console.log(pagos.pagosJSON);

      this.pagos = pagos.pagosJSON;

      this.totalPages = pagos.totalPages;
      this.currentPage = pagos.currentPage;

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
      this.getPagos(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;

    this.getPagos(1);

  }

  createPago() {
    this.router.navigateByUrl('dashboard/pagos2/pago');
  }

  editPago(pago: Pago) {
    this.router.navigate(['dashboard/pagos2/pago', pago.id]);
  }

  viewPago(pago: Pago) {
    this.router.navigate(['dashboard/pagos2/pago/view', pago.id]);
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

}
