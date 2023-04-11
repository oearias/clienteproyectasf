import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/interfaces/Role';
import { RolesService } from 'src/app/services/roles.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  roleForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
  });

  editingRole: Role;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RolesService,
    private toastr: ToastrService,
  ) { 
    this.roleForm.setValue({
      id: null,
      nombre: null,
      descripcion: null,
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.roleService.getRole(params.id).subscribe(res => {

          this.editingRole = res;

          this.id?.setValue(this.editingRole.id);
          this.nombre?.setValue(this.editingRole.nombre);
          this.descripcion?.setValue(this.editingRole.descripcion);
        });

      }
    });
  }

  saveRole() {

    if (this.roleForm.valid) {

      if (this.roleForm.value.id != null) {

        this.roleService.updateRole(this.roleForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.roleService.insertRole(this.roleForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/settings/roles');

    }
  }

  volver() {
    this.router.navigate(['/settings/roles']);
  }

  setPath(){
    this.pathService.path = '/settings/roles';
  }

  //Getters
  get id() {
    return this.roleForm.get('id');
  }

  get nombre() {
    return this.roleForm.get('nombre');
  }

  get descripcion() {
    return this.roleForm.get('descripcion');
  }


}
