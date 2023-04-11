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

  subscription: Subscription;

  //Paginate
  p: number = 1;
  itemsPP: number = 15;
  selectedItem = this.itemsPP;
  
  items = [
    { cant: 10 },
    { cant: 15 },
    { cant: 20 },
    { cant: 25 },
  ];

  //Filter
  criterios = [
    { nombre: 'nombre', criterio: 'a.nombre' },
    { nombre: 'apellido paterno', criterio: 'a.apellido_paterno' },
    { nombre: 'apellido materno', criterio: 'a.apellido_materno' },
    { nombre: 'email', criterio: 'a.email' },
    { nombre: 'rol', criterio: 'b.nombre' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

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
    this.getUsuarios();

    this.subscription = this.usuarioService.refresh$.subscribe(() => {
      this.getUsuarios();
    });


  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe((res: any) => {

      this.usuarios = res;

    });
  }

  createUsuario() {
    //this.router.navigateByUrl('settings/usuarios/usuario');
    this.router.navigateByUrl('settings/usuarios/usuario2');
  }

  editUsuario(usuario: Usuario) {
    
    this.router.navigate(['settings/usuarios/usuario', usuario.id]);
  }

  changePassword(usuario: Usuario){
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

          if(error['msg']){
            return this.toastr.error(error['msg']);
          }

          this.toastr.error(error.errors['msg']);
        })


      }
    });
  }

  selectUser(usuario: Usuario){
    this.router.navigate(['settings/usuarios/usuario2',usuario.id])
  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.usuarioService.getUsuariosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.usuarios = res;
      }, err => {
        this.toastr.error(err.error.msg);
      })

    } else {
      this.toastr.error('Por favor llene todos los campos del filtro')
    }

  }

  limpiar() {
    this.filterForm.reset();
    this.ngOnInit();
    this.router.navigate(['settings/usuarios/usuario2']);
  }

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  get criterio() {
    return this.filterForm.get('criterio');
  }

  get palabra() {
    return this.filterForm.get('palabra');
  }

}
