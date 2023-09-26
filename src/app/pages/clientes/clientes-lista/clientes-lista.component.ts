import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Cliente } from 'src/app/interfaces/Cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteResponse } from 'src/app/interfaces/ClienteResponse';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = [];
  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: any;

  constructor(
    private clienteService: ClientesService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getClientes(this.currentPage);

    this.subscription = this.clienteService.refresh$.subscribe(() => {
      this.getClientes(this.currentPage);
    });
  }

  getClientes(page: number, limit:number = 10) {
    this.clienteService.getClientesPaginados(page, limit, this.busqueda).subscribe((res: ClienteResponse) => {

      this.clientes = res.clientesJSON;
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage

    });
  }

  createCliente() {
    this.router.navigateByUrl('dashboard/clientes/cliente');
  }

  editCliente(cliente: Cliente) {
    this.router.navigate(['dashboard/clientes/cliente', cliente.id]);
  }

  deleteCliente(cliente: Cliente){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${cliente.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.deleteCliente(cliente).subscribe( (res:any) => {
          if(res){

            // Swal.fire(
            //   '¡Eliminado!',
            //   'El registro ha sido eliminado',
            //   'success'
            // );
            this.toastr.success(res);

          }
        }, (err) => {

          Swal.fire({
            title:'¡Ups!',
            html:`No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
            icon:'warning'
          });
        })

        
      }
    });
  }

  viewContractsByCliente(cliente:Cliente){
    this.router.navigate(['dashboard/clientes/creditos/cliente', cliente.id]);
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
      this.getClientes(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getClientes(1);

  }


}
