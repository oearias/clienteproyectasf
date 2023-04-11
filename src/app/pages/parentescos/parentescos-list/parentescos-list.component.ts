import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Ocupacion } from 'src/app/interfaces/Ocupacion';
import { Parentesco } from 'src/app/interfaces/Parentesco';
import { ModalService } from 'src/app/services/modal.service';
import { ParentescosService } from 'src/app/services/parentescos.service';

@Component({
  selector: 'app-parentescos-list',
  templateUrl: './parentescos-list.component.html',
  styleUrls: ['./parentescos-list.component.css']
})
export class ParentescosListComponent implements OnInit {

  parentescos: Parentesco[] = [];

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
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private parentescoService:ParentescosService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getParentescos();

    this.subscription = this.parentescoService.refresh$.subscribe(() => {
      this.getParentescos();
    });

    //Actualiza la lista despues de la acción del Modal
    this.subscription = this.modalService.refresh$.subscribe(() => {
      this.getParentescos();
    });
  }

  getParentescos() {
    this.parentescoService.getParentescos().subscribe((res: any) => {

      this.parentescos = res;

    });
  }

  createParentesco() {
    this.router.navigateByUrl('catalogos/parentescos/parentesco');
  }

  editParentesco(parentesco: Parentesco) {
    this.router.navigate(['catalogos/parentescos/parentesco', parentesco.id]);
  }

  showModal(parentesco: Parentesco) {

    this.modalService.showModal = true;
    this.modalService.registro = `${parentesco.nombre}`
    this.modalService.id = parentesco.id;
    this.modalService.path = 'tipos/parentesco/';

  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.parentescoService.getParentescosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.parentescos = res;
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
