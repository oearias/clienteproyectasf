import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { TipoEmpleo } from 'src/app/interfaces/TipoEmpleo';
import { ModalService } from 'src/app/services/modal.service';
import { TipoEmpleoService } from '../../../services/tipo-empleo.service';



@Component({
  selector: 'app-empleos-list',
  templateUrl: './empleos-list.component.html',
  styleUrls: ['./empleos-list.component.css']
})
export class EmpleosListComponent implements OnInit {

  tipoEmpleos: TipoEmpleo[] = [];

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
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private tipoEmpleoService: TipoEmpleoService,
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
    this.getTipoEmpleos();

    this.subscription = this.tipoEmpleoService.refresh$.subscribe(() => {
      this.getTipoEmpleos();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getTipoEmpleos();
    });
  }

  getTipoEmpleos() {
    this.tipoEmpleoService.getTipoEmpleos().subscribe((res: any) => {

      this.tipoEmpleos = res;

    });
  }

  createTipoEmpleo() {
    this.router.navigateByUrl('catalogos/empleos/empleo');
  }

  editTipoEmpleo(te: TipoEmpleo) {
    this.router.navigate(['catalogos/empleos/empleo', te.id]);
  }

  deleteTipoEmpleo(te: TipoEmpleo){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${te.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tipoEmpleoService.deleteTipoEmpleo(te).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        })

        
      }
    });
  }

  showModal(te: TipoEmpleo) {

    this.modalService.showModal = true;
    this.modalService.registro = `${te.nombre}`
    this.modalService.id = te.id;
    this.modalService.path = 'tipos/empleo/';

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.tipoEmpleoService.getTipoEmpleosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.tipoEmpleos = res;
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
