import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Agencia } from 'src/app/interfaces/Agencia';
import { AgenciasService } from 'src/app/services/agencias.service';
import { ModalService } from 'src/app/services/modal.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-agencias-list',
  templateUrl: './agencias-list.component.html',
  styleUrls: ['./agencias-list.component.css']
})
export class AgenciasListComponent implements OnInit {

  agencias: Agencia[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  })

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

  //Filter
  criterios = [
    { nombre: 'nombre', criterio: 'a.nombre' },
    { nombre: 'zona', criterio: 'b.nombre' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private agenciaService: AgenciasService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { 
    this.filterForm.setValue({
      criterio: null,
      palabra: null
    });
  }

  ngOnInit(): void {
    this.getAgencias();

    this.subscription = this.agenciaService.refresh$.subscribe(() => {
      this.getAgencias();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getAgencias();
    });
  }

  getAgencias() {
    this.agenciaService.getAgencias().subscribe((res: any) => {

      this.agencias = res;

    });
  }

  createAgencia() {
    this.router.navigateByUrl('catalogos/agencias/agencia');
  }

  editAgencia(agencia: Agencia) {
    this.router.navigate(['catalogos/agencias/agencia', agencia.id]);
  }

  deleteAgencia(sucursal: Agencia){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${sucursal.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.agenciaService.deleteAgencia(sucursal).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        })

        
      }
    });
  }

  showModal(agencia: Agencia) {

    this.modalService.showModal = true;
    this.modalService.registro = `${agencia.nombre}`
    this.modalService.id = agencia.id;
    this.modalService.path = 'agencias/';

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.agenciaService.getAgenciasByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.agencias = res;
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
