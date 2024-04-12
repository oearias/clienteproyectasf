import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Tarifa } from 'src/app/interfaces/Tarifa';
import { TarifasService } from '../../../services/tarifas.service';
import { ToastrService } from 'ngx-toastr';
import { TarifaResponse } from 'src/app/interfaces/TarifaResponse';

@Component({
  selector: 'app-tarifas-list',
  templateUrl: './tarifas-list.component.html',
  styleUrls: ['./tarifas-list.component.css']
})
export class TarifasListComponent implements OnInit {

  tarifas: Tarifa[] = [];
  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;

  constructor(
    private tarifaService: TarifasService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTarifas(this.currentPage);

    this.subscription = this.tarifaService.refresh$.subscribe(() => {
      this.getTarifas(this.currentPage);
    });

  }

  getTarifas(page:number, limit:number=10){
    this.tarifaService.getTarifasPaginadas(page, limit, this.busqueda).subscribe( (res:TarifaResponse) =>{
      
      this.tarifas = res.tarifasJSON;
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage;

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
      this.getTarifas(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getTarifas(1);

  }

}
