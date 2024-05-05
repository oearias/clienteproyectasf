import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ColoniasService } from '../../../services/colonias.service';
import { ColoniaResponse } from 'src/app/interfaces/ColoniaResponse';
import { Colonia } from '../../../interfaces/Colonia';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-colonias-list',
  templateUrl: './colonias-list.component.html',
  styleUrls: ['./colonias-list.component.css']
})
export class ColoniasListComponent implements OnInit {

  colonias: Colonia[] = [];
  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;


  constructor(
    private coloniaService: ColoniasService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getColonias(this.currentPage);

    this.subscription = this.coloniaService.refresh$.subscribe(() => {
      this.getColonias(this.currentPage);
    });

  }


  getColonias(page:number, limit:number = 10) {
    this.coloniaService.getColoniasPaginadas(page, limit, this.busqueda).subscribe((res: ColoniaResponse) => {



      this.colonias = res.coloniasJSON;
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage;

      console.log(this.colonias);

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
      this.getColonias(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getColonias(1);

  }

}
