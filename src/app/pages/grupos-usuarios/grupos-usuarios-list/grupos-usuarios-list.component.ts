import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { GrupoUsuario } from 'src/app/interfaces/GrupoUsuario';
import { GrupoUsuarioResponse } from 'src/app/interfaces/GrupoUsuarioResponse';
import { GrupoUsuarioService } from 'src/app/services/grupo-usuario.service';

@Component({
  selector: 'app-grupos-usuarios-list',
  templateUrl: './grupos-usuarios-list.component.html',
  styleUrls: ['./grupos-usuarios-list.component.css']
})
export class GruposUsuariosListComponent implements OnInit {

  gruposUsuarios: GrupoUsuario[] = [];
  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: any;

  constructor(
    private grupoUsuarioService: GrupoUsuarioService,
    private router: Router,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    this.getGruposUsuarios(this.currentPage);

    this.subscription = this.grupoUsuarioService.refresh$.subscribe(() => {
      this.getGruposUsuarios(this.currentPage);
    });
  }

  getGruposUsuarios(page: number, limit:number = 10) {
    this.grupoUsuarioService.getGruposUsuarios(page, limit, this.busqueda).subscribe((res: GrupoUsuarioResponse) => {

      this.gruposUsuarios = res.gruposUsuariosJSON;
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage

      console.log(this.gruposUsuarios);

    });
  }

  createGrupoUsuario() {
    this.router.navigateByUrl('settings/gruposUsuarios/gruposUsuario');
  }

  editGrupoUsuario(grupoUsuario: GrupoUsuario) {
    this.router.navigate(['settings/gruposUsuarios/gruposUsuario', grupoUsuario]);
  }

  viewGrupoUsuario(grupoUsuario: GrupoUsuario){
    this.router.navigate(['settings/gruposUsuarios/gruposUsuarioView', grupoUsuario.id]);
  }

  deleteGrupoUsuario(grupousuario: GrupoUsuario) {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar el grupo de usuario: <br><b>${grupousuario.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.grupoUsuarioService.deleteGrupoUsuario(grupousuario).subscribe( (res:any) => {
          
          if(res){

            this.toastr.success(res);

          }
        }, (err) => {

          console.log(err);

          Swal.fire({
            title:'¡Ups!',
            html:`${err}`,
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
      this.getGruposUsuarios(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getGruposUsuarios(1);

  }

}
