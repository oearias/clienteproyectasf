import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Role } from 'src/app/interfaces/Role';
import { RolesService } from 'src/app/services/roles.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {

  roles: Role[] = [];

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
    private roleService: RolesService,
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
    this.getRoles();

    this.subscription = this.roleService.refresh$.subscribe(() => {
      this.getRoles();
    });


  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {

      this.roles = res;

    });
  }

  createRole() {
    this.router.navigateByUrl('settings/roles/role');
  }

  editRole(role: Role) {
    this.router.navigate(['settings/roles/role', role.id]);
  }

  deleteRole(role: Role) {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${role.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.roleService.deleteRole(role).subscribe((res: any) => {
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
      this.roleService.getRolesByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.roles = res;
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
