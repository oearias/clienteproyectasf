import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Ocupacion } from 'src/app/interfaces/Ocupacion';
import { ModalService } from 'src/app/services/modal.service';
import { OcupacionesService } from '../../../services/ocupaciones.service';

@Component({
  selector: 'app-ocupaciones-list',
  templateUrl: './ocupaciones-list.component.html',
  styleUrls: ['./ocupaciones-list.component.css']
})
export class OcupacionesListComponent implements OnInit {

  ocupaciones: Ocupacion[] = [];

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

  //Filter
  criterios = [
    { nombre: 'nombre', criterio: 'a.nombre' },
    { nombre: 'sucursal', criterio: 'b.nombre' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private ocupacionesService:OcupacionesService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getOcupaciones();

    this.subscription = this.ocupacionesService.refresh$.subscribe(() => {
      this.getOcupaciones();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getOcupaciones();
    });
  }

  getOcupaciones() {
    this.ocupacionesService.getOcupaciones().subscribe((res: any) => {

      this.ocupaciones = res;

    });
  }

  createOcupacion() {
    this.router.navigateByUrl('catalogos/ocupaciones/ocupacion');
  }

  editOcupacion(ocupacion: Ocupacion) {
    this.router.navigate(['catalogos/ocupaciones/ocupacion', ocupacion.id]);
  }

  showModal(ocupacion: Ocupacion) {

    this.modalService.showModal = true;
    this.modalService.registro = `${ocupacion.nombre}`
    this.modalService.id = ocupacion.id;
    this.modalService.path = 'ocupaciones/';

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.ocupacionesService.getOcupacionesByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.ocupaciones = res;
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
