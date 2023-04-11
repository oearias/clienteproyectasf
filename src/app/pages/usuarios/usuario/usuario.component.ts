import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { RolesService } from '../../../services/roles.service';
import { Role } from 'src/app/interfaces/Role';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {


  roles:Role[] = []

  usuarioForm = this.fb.group({
    id: new FormControl(null),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
    apellido_paterno: new FormControl(null, Validators.required),
    apellido_materno: new FormControl(null),
    role_id: new FormControl(null, Validators.required)
  });

  editingUsuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuariosService,
    private roleService: RolesService,
    private toastr: ToastrService,
  ) { 
    this.usuarioForm.setValue({
      id: null,
      email: null,
      password: null,
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

        this.usuarioService.getUsuario(params.id).subscribe(res => {

          this.editingUsuario = res;

          this.id?.setValue(this.editingUsuario.id);
          this.email?.setValue(this.editingUsuario.email);
          this.password?.setValue(123456);
          this.nombre?.setValue(this.editingUsuario.nombre);
          this.apellido_paterno?.setValue(this.editingUsuario.apellido_paterno);
          this.apellido_materno?.setValue(this.editingUsuario.apellido_materno);
          this.role_id?.setValue(this.editingUsuario.role_id);
        });

      }
    });
  }

  getRoles(){
    this.roleService.getRoles().subscribe(roles =>{
      this.roles = roles;
    })
  }

  saveUsuario() {

    if (this.usuarioForm.valid) {

      if (this.usuarioForm.value.id != null) {

        this.usuarioService.updateUsuario(this.usuarioForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.usuarioService.insertUsuario(this.usuarioForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/settings/usuarios');

    }
  }

  volver() {
    this.router.navigate(['/settings/usuarios']);
  }

  //Getters
  get id() {
    return this.usuarioForm.get('id');
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
