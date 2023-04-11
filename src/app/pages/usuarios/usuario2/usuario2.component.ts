import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Role } from 'src/app/interfaces/Role';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-usuario2',
  templateUrl: './usuario2.component.html',
  styleUrls: ['./usuario2.component.css']
})
export class Usuario2Component implements OnInit {

  editingUsuario: Usuario;
  roles: Role[] = [];

  labelNombre = '';
  labelEmail = '';
  labelRole = '';

  usuarioForm = this.fb.group({
    id: new FormControl(null),
    usuario: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
    apellido_paterno: new FormControl(null, Validators.required),
    apellido_materno: new FormControl(null),
    role_id: new FormControl(null, Validators.required)
  });

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.usuarioForm.setValue({
      id: null,
      email: null,
      password: null,
      usuario: null,
      nombre: null,
      apellido_paterno: null,
      apellido_materno: null,
      role_id: null
    });
  }

  ngOnInit(): void {

    this.getRoles();

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.usuarioService.getUsuario(params.id).subscribe(usuario => {

          this.labelNombre = usuario?.nombre_completo;

          this.editingUsuario = usuario;

          this.id?.setValue(this.editingUsuario?.id);
          this.email?.setValue(this.editingUsuario?.email);
          this.usuario?.setValue(this.editingUsuario.usuario);
          this.password?.setValue(123456);
          this.nombre?.setValue(this.editingUsuario?.nombre);
          this.apellido_paterno?.setValue(this.editingUsuario?.apellido_paterno);
          this.apellido_materno?.setValue(this.editingUsuario?.apellido_materno);
          this.role_id?.setValue(this.editingUsuario?.role_id);
        });

      }
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  saveUsuario() {

    if (this.usuarioForm.valid) {

      if (this.usuarioForm.value.id != null) {

        Swal.fire({
          title: 'Modificar',
          html: `¿Está ud. seguro que desea modificar a <br><b>${this.editingUsuario?.nombre_completo}</b>?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#2f5ade',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, Modificar!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.usuarioService.updateUsuario(this.usuarioForm.value).subscribe((res: any) => {

              this.toastr.success(res);

              this.router.navigateByUrl('/settings/usuarios/usuario2');
              this.usuarioForm.reset();
              this.editingUsuario = null;

            });


          }
        });

        //


      } else {

        console.log(this.usuarioForm.value);

        this.usuarioService.insertUsuario(this.usuarioForm.value).subscribe((res: any) => {

          this.toastr.success(res);

          this.router.navigateByUrl('/settings/usuarios/usuario2');
          this.usuarioForm.reset();
          this.editingUsuario = null;
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

    }
  }

  deleteUsuario() {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro que desea eliminar a <br><b>${this.editingUsuario?.nombre_completo}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.deleteUsuario(this.editingUsuario).subscribe((res: any) => {
          if (res) {

            this.toastr.success(res);
            this.usuarioForm.reset();
            this.editingUsuario = null;

            this.router.navigateByUrl('/settings/usuarios/usuario2');

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

  changePassword() {

    this.router.navigate(['settings/usuarios/changePassword', this.editingUsuario.id]);

  }

  //Getters
  get id() {
    return this.usuarioForm.get('id');
  }

  get usuario(){
    return this.usuarioForm.get('usuario');
  }

  get email() {
    return this.usuarioForm.get('email');
  }

  get password() {
    return this.usuarioForm.get('password');
  }

  get nombre() {
    return this.usuarioForm.get('nombre');
  }

  get apellido_paterno() {
    return this.usuarioForm.get('apellido_paterno');
  }

  get apellido_materno() {
    return this.usuarioForm.get('apellido_materno');
  }

  get role_id() {
    return this.usuarioForm.get('role_id');
  }

}
