import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Credito } from 'src/app/interfaces/Credito';
import Swal from 'sweetalert2';
import { CreditosService } from '../../../services/creditos.service';


@Component({
  selector: 'app-creditos-lista',
  templateUrl: './creditos-lista.component.html',
  styleUrls: ['./creditos-lista.component.css']
})
export class CreditosListaComponent implements OnInit {


  constructor(
    private creditoService: CreditosService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  creditos: Credito[] = [];
  fechaInicio: Date;

  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;

  //Sort
  key = 'id';
  reverse: boolean = false;

  ngOnInit(): void {

    this.getCreditos(this.currentPage);

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getCreditos(this.currentPage);
    });
  }

  getCreditos(page: number, limit: number = 10) {

    this.creditoService.getCreditosPaginados(page, limit, this.busqueda).subscribe((creditos) => {

      this.creditos = creditos.creditosJSON;
      this.totalPages = creditos.totalPages;
      this.currentPage = creditos.currentPage;

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
      this.getCreditos(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getCreditos(1);

  }



  createCredito() {
    this.router.navigateByUrl('dashboard/creditos/credito');
  }

  editCredito(credito: Credito) {
    this.router.navigate(['dashboard/creditos/credito', credito.id]);
  }

  deleteCredito(credito: Credito) {
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar <br>el crédito <b>${credito.id}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.creditoService.deleteCredito(credito).subscribe((res: any) => {
          if (res) {

            this.toastr.success(res);

          }
        }, (err) => {

          Swal.fire({
            title: '¡Ups!',
            html: `No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
            icon: 'warning'
          });
        })


      }
    });
  }

  viewCredito(credito: Credito) {
    this.router.navigate(['dashboard/creditos/credito/view', credito.id]);
  }

  printAllDocumentation(credito: Credito) {

    let arrayToPrint = [];

    //Datos que se necesitan para imprimir en esa API
    arrayToPrint.push({
      credito_id: credito.id,
      printSelected: true,
      fecha_inicio: credito.fecha_inicio_prog
    });

    //Hay que arreglar, por lo pronto se utiliza la api de abajo
    //this.creditoService.downloadAllDocumentation(credito);

    //Esta api se tuvo que implementar por que la anterior falla en las medidas y estilos
    //Debido a los cambios iimplementados en la tarjeta de pagos que se imprime en mitades de hojas
    this.creditoService.printContratosMasivos(arrayToPrint);
  }

  printCreditos() {

    if(this.fechaInicio!= null){
      this.creditoService.downloadCreditos(this.fechaInicio);
    }else{

      Swal.fire({
        title: 'Fecha de inicio',
        html: `Seleccione una fecha de inicio para poder generar el reporte`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: 'Entendido',
        confirmButtonAriaLabel: 'send'
      });

    }

  }

  goCreateCreditos() {
    this.router.navigate(['dashboard/creditos/createCreditos'])
  }

  onChangeFechaInicio(event:any, inputFechaInicio:HTMLInputElement){
    
    if(event){
      this.fechaInicio = new Date(inputFechaInicio.value);

    }
  }


}
