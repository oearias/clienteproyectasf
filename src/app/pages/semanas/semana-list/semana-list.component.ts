import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Semana } from 'src/app/interfaces/Semana';
import { SemanasService } from '../../../services/semanas.service';

import Swal from 'sweetalert2';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-semana-list',
  templateUrl: './semana-list.component.html',
  styleUrls: ['./semana-list.component.css']
})
export class SemanaListComponent implements OnInit {

  @ViewChild('selectEstatus') selectEstatus: NgSelectComponent;
  @ViewChild('inputAux') inputAux: ElementRef;

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required),
  })

  semanas: Semana[] = [];
  
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
  ]

  criterios = [
    { nombre: 'estatus', criterio: 'estatus' },
    { nombre: 'año', criterio: 'year' },
    { nombre: 'n. de semana', criterio: 'weekyear' },
    { nombre: 'serie', criterio: 'serie' },
  ];

  estatus = [
    {nombre: 'ABIERTA', value: true},
    {nombre: 'CERRADA', value: false},
  ]

  //Sort
  key = 'year';
  reverse: boolean = false;

  constructor(
    private semanaService: SemanasService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getSemanas();

    this.subscription = this.semanaService.refresh$.subscribe(() => {
      this.getSemanas();
    });
  }


  getSemanas() {
    this.semanaService.getSemanas().subscribe((res: any) => {
      this.semanas = res;
    });
  }

  createSemana() {
    this.router.navigateByUrl('catalogos/semanas/semana');
  }

  createYear(){
    this.router.navigateByUrl('catalogos/semanas/year')
  }

  createSemanasMasivas(){
    this.router.navigateByUrl('catalogos/semanas/semanasMasivas');
  }

  editSemana(semana: Semana) {
    this.router.navigate(['catalogos/semanas/semana', semana.id]);
  }

  deleteSemana(semana: Semana) {

    //prguntamos que la smena a eliminar no sea o esté abierta
    if (!semana.estatus) {
      Swal.fire({
        title: 'Eliminar',
        html: `¿Está ud. seguro de eliminar la semana n. <br><b>${semana.weekyear}</b>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2f5ade',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.semanaService.deleteSemana(semana).subscribe((res: any) => {
            if (res) {

              this.toastr.success(res);

            }
          }, err => {

            this.toastr.error(err.error['msg']);

          })


        }
      });
    } else {
      Swal.fire({
        title: 'Ups',
        html: `No es posible eliminar semana ABIERTA`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });
    }


  }

  onChangeCriterio(event: any){
    if(event){

      this.inputAux.nativeElement.value = null;
      this.palabra.setValue(null);

      if(event.criterio === 'estatus'){

        this.selectEstatus.readonly = false;
        this.inputAux.nativeElement.disabled = true;

      }else{

        this.palabra.enable();
        this.inputAux.nativeElement.disabled = false;
        this.selectEstatus.handleClearClick();
        this.selectEstatus.readonly = true;

      }
    }
  }

  onChangeSelectEstatus(event:any){
    if(event){

      this.palabra?.setValue(event?.value);
    }
  }

  onKeyUp(){
    this.palabra.setValue(this.inputAux.nativeElement.value);
  }

  cambiaItems(event:any) {
    this.itemsPP = event.cant
  }

  search() {

    console.log(this.filterForm.value);

    if (this.filterForm.valid) {
      this.semanaService.getSemanasByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra).subscribe((res) => {
        this.semanas = res;
      }, err => {
        this.toastr.error(err.error.msg);
      })

    } else {
      this.toastr.error('Por favor llene todos los campos del filtro')
    }

  }

  limpiar() {
    this.filterForm.reset();
    this.selectEstatus.clearModel();
    this.ngOnInit();
  }

  onClearSelectStatus(){
    this.palabra?.setValue(null);
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
