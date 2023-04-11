import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { RolesService } from 'src/app/services/roles.service';
import { RoleUser } from '../../../interfaces/RoleUser';
import { RoleUserService } from '../../../services/role-user.service';

@Component({
  selector: 'app-roles-usuarios-list',
  templateUrl: './roles-usuarios-list.component.html',
  styleUrls: ['./roles-usuarios-list.component.css']
})
export class RolesUsuariosListComponent implements OnInit {

  rolesUser: RoleUser[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  });

  subscription: Subscription;

  //Paginate
  p: number = 1;
  itemsPP: number = 10;
  selectedItem = this.itemsPP;
  
  items = [
    { cant: 5 },
    { cant: 10 },
    { cant: 15 },
    { cant: 20 },
    { cant: 25 },
  ];

  criterios = [
    { nombre: 'nombre', criterio: 'nombre' },
    { nombre: 'clave', criterio: 'clave' },
  ];

  //Sort
  key = 'id';
  reverse: boolean = false;

  constructor(
    private roleUserService: RoleUserService,
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
    this.getRolesUser();

    this.subscription = this.roleUserService.refresh$.subscribe(() => {
      this.getRolesUser();
    });


  }

  getRolesUser() {
    this.roleUserService.getRolesUser().subscribe((res: any) => {

      console.log(res);

      this.rolesUser = res;

    });
  }

  createRoleUser() {
    this.router.navigateByUrl('settings/roles-usuarios/assign');
  }

  editRoleUser(ru: RoleUser) {
    this.router.navigate(['settings/roles-usuarios/role', ru.id]);
  }

  deleteRoleUser(ru: RoleUser) {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${ru.id}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.roleUserService.deleteRoleUser(ru).subscribe((res: any) => {
          if (res) {

            this.toastr.success(res);

          }
        }, ({ error }) => {


          if(error['msg']){
            return this.toastr.error(error['msg']);
          }

          this.toastr.error(error.errors['msg']);
        })


      }
    });
  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.roleUserService.getRolesByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.rolesUser = res;
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
