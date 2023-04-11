import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleUser } from '../../../interfaces/RoleUser';
import { RolesService } from '../../../services/roles.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { RoleUserService } from '../../../services/role-user.service';
import { Role } from 'src/app/interfaces/Role';
import { Usuario } from '../../../interfaces/Usuario';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-role-usuario',
  templateUrl: './role-usuario.component.html',
  styleUrls: ['./role-usuario.component.css']
})
export class RoleUsuarioComponent implements OnInit {

  roles: any = [];
  usuarios: any = [];

  roleUserForm = this.fb.group({
    id: new FormControl(null),
    roles: new FormArray([]),
    usuario_id: new FormControl(null, Validators.required),
    role_id: new FormControl(null, Validators.required),
  });

  editingRoleUser: RoleUser;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private roleService: RolesService,
    private usuarioService: UsuariosService,
    private roleUserService: RoleUserService
  ) {
    this.roleUserForm.setValue({
      id: null,
      roles: [],
      usuario_id: null,
      role_id: null,
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.getRoles();
    this.getUsuarios();

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.roleUserService.getRoleUser(params.id).subscribe(res => {

          this.editingRoleUser = res;

          this.id?.setValue(this.editingRoleUser.id);
          this.usuario_id?.setValue(this.editingRoleUser.usuario_id);
          this.role_id.setValue(this.editingRoleUser.role_id);
        });

      }
    });

  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe((usuarios: any) => {

      this.usuarios = usuarios.map((usuario: Usuario) => {
        if (!usuario.apellido_materno) {
          usuario.apellido_materno = ' '
        }
        usuario.nombre = `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
        return usuario;
      });

    })
  }

  getRoles() {
    this.roleService.getRoles().subscribe(res => {
      this.roles = res;
    })
  }

  saveRoleUser() {

    console.log(this.roleUserForm.value);

    if (this.roleUserForm.valid) {

      if (this.roleUserForm.value.id != null) {

        this.roleUserService.updateRoleUser(this.roleUserForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        /*this.roleUserService.insertRoleUser(this.roleUserForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });*/

        console.log(this.roleUserForm.value);
      }

      this.router.navigateByUrl('/settings/roles-usuarios');

    }
  }

  changeCheckBox(role: Role, event: any) {
    console.log(role, event.target.checked);

    if (event.target.checked == true) {
      this.addRole(role)
    }

  }

  addRole(role: Role) {

    const group = new FormGroup({
      id: new FormControl(role.id),
      role_nombre: new FormControl(null)
    });


    this.first.push(group);

  }

  volver() {
    this.router.navigate(['/settings/roles-usuarios']);
  }

  setPath() {
    this.pathService.path = '/settings/roles-usuarios';
  }

  //Getters
  get id() {
    return this.roleUserForm?.get('id');
  }

  get usuario_id() {
    return this.roleUserForm?.get('usuario_id');
  }

  get role_id() {
    return this.roleUserForm?.get('role_id');
  }

  get first() {
    return this.roleUserForm.get('roles') as FormArray;
  }

}
