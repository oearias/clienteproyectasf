import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Credito } from 'src/app/interfaces/Credito';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';
import { CreditosService } from '../../../services/creditos.service';

@Component({
  selector: 'app-creditos-list',
  templateUrl: './creditos-list.component.html',
  styleUrls: ['./creditos-list.component.css']
})
export class CreditosListComponent implements OnInit {

  constructor(
    private creditoService: CreditosService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  creditos: Credito[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  })

  subscription: Subscription;

  //Paginate
  p: number = 1;
  itemsPP: number = 20;
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
    { nombre: 'nombre', criterio: 'nombre' },
    { nombre: 'número de contrato', criterio: 'num_contrato' },
  ];

  //Sort
  key = '';
  reverse: boolean = false;

  ngOnInit(): void {
    this.getCreditos();

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getCreditos();
    });

  }

  getCreditos(){
    this.creditoService.getCreditos().subscribe( (creditos) => {

      // this.creditos = creditos.filter(item => item.preaprobado!= 1); //unicamente créditos entregados

      this.creditos = creditos;

      console.log(this.creditos);

    });
  }

  createCredito() {
    this.router.navigateByUrl('dashboard/creditos/credito');
  }

  editCredito(credito: Credito) {
    this.router.navigate(['dashboard/creditos/credito', credito.id]);
  }

  deleteCredito(credito: Credito){
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar <br>el crédito <b>${credito.id}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.creditoService.deleteCredito(credito).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        }, (err) => {

          Swal.fire({
            title:'¡Ups!',
            html:`No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
            icon:'warning'
          });
        })

        
      }
    });
  }

  viewCredito(credito: Credito){
    this.router.navigate(['dashboard/creditos/credito/view', credito.id]);
  }

  printAllDocumentation(credito:Credito) {
    this.creditoService.downloadAllDocumentation(credito);
  }

  goCreateCreditos(){
    this.router.navigate(['dashboard/creditos/createCreditos'])
  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.creditoService.getCreditosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.creditos = res;
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
