import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  })

  currentPage: number = 1;
  totalPages: number = 1;
  busqueda = '';

  subscription: Subscription;



  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm.setValue({
      criterio: null,
      palabra: null
    });
  }

  ngOnInit(): void {
    this.getUsuarios(this.currentPage);

    this.subscription = this.usuarioService.refresh$.subscribe(() => {
      this.getUsuarios(this.currentPage);
    });


  }

  // getUsuarios() {

  //   this.usuarioService.getUsuarios().subscribe((res: any) => {

  //     this.usuarios = res;

  //   });
  // }

  getUsuarios(page: number, limit: number = 10) {

    this.usuarioService.getUsuariosPaginados(page, limit, this.busqueda).subscribe(res => {

      this.usuarios = res.usuariosJSON;
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
      this.getUsuarios(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    console.log(terminoBusqueda);

    this.busqueda = terminoBusqueda;
    this.getUsuarios(1);

  }

  createUsuario() {
    //this.router.navigateByUrl('settings/usuarios/usuario');
    this.router.navigateByUrl('settings/usuarios/usuario2');
  }

  editUsuario(usuario: Usuario) {

    this.router.navigate(['settings/usuarios/usuario', usuario.id]);
  }

  changePassword(usuario: Usuario) {
    this.router.navigate(['settings/usuarios/changePassword', usuario.id]);
  }

  deleteUsuario(usuario: Usuario) {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${usuario.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.deleteUsuario(usuario).subscribe((res: any) => {
          if (res) {

            this.toastr.success(res);

          }
        }, ({ error }) => {

          console.log(error);

          if (error['msg']) {
            return this.toastr.error(error['msg']);
          }

          this.toastr.error(error.errors['msg']);
        })


      }
    });
  }

  selectUser(usuario: Usuario) {
    this.router.navigate(['settings/usuarios/usuario2', usuario.id])
  }


  // limpiar() {
  //   this.busqueda='';
  //   this.ngOnInit();
  //   this.router.navigate(['settings/usuarios/usuario2']);
  // }



}
