import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Credito } from 'src/app/interfaces/Credito';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';
import { CreditosService } from '../../../services/creditos.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EstatusSolicitud } from 'src/app/interfaces/EstatusSolicitud';
import { CreditoEstatusService } from 'src/app/services/credito-estatus.service';

@Component({
  selector: 'app-creditos-list',
  templateUrl: './creditos-list.component.html',
  styleUrls: ['./creditos-list.component.css']
})
export class CreditosListComponent implements OnInit {

  @ViewChild('selectEstatus') selectEstatus: NgSelectComponent;
  @ViewChild('inputFechaInicio') inputFechaInicio: ElementRef;
  @ViewChild('inputAux') inputAux: ElementRef;

  constructor(
    private creditoEstatusService: CreditoEstatusService,
    private creditoService: CreditosService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
   }

  creditos: Credito[] = [];
  fechaInicio: Date;

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  });

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
    { nombre: 'Nombre', criterio: 'nombre' },
    { nombre: 'Apellido paterno', criterio: 'apellido_paterno' },
    { nombre: 'Apellido materno', criterio: 'apellido_materno' },
    // { nombre: 'Estatus', criterio: 'estatus_id'},
    { nombre: 'Estatus', criterio: 'estatus_id'},
    { nombre: 'Número de contrato', criterio: 'num_contrato' },
    { nombre: 'Fecha de inicio', criterio: 'fecha_inicio_prog' },
  ];

  //Estatus
  estatus: EstatusSolicitud[] = [];

  //Sort
  key = 'id';
  reverse: boolean = false;

  ngOnInit(): void {

    this.loadEstatusCredito();
    this.getCreditos();

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getCreditos();
    });

  }

  getCreditos(){
    this.creditoService.getCreditos().subscribe( (creditos) => {

      // this.creditos = creditos.filter(item => item.preaprobado!= 1); //unicamente créditos entregados

      this.creditos = creditos;

      console.log(creditos);


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

    let arrayToPrint = [];

    //Datos que se necesitan para imprimir en esa API
    arrayToPrint.push({
      credito_id: credito.id,
      printSelected: true,
      fecha_inicio: credito.fecha_inicio_prog
    });

    //Hay que arreglar, por lo pronto se utiliza la api de abajo
    //this.creditoService.downloadAllDocumentation(credito);

    //Esta api se tuvo que implementar por que la anterior falla en las medidas y estilos
    //Debido a los cambios iimplementados en la tarjeta de pagos que se imprime en mitades de hojas
    this.creditoService.printContratosMasivos(arrayToPrint);
  }

  printCreditos(){

    this.creditoService.downloadCreditos(this.fechaInicio);

  }

  goCreateCreditos(){
    this.router.navigate(['dashboard/creditos/createCreditos'])
  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.creditoService.getCreditosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra).subscribe((res) => {
        this.creditos = res;
      }, err => {
        this.toastr.error(err.error.msg);
      })

    } else {
      this.toastr.error('Por favor llene todos los campos del filtro')
    }

  }

  onChangeCriterio(event: any){
    if(event){

      this.inputAux.nativeElement.value = null;
      this.palabra.setValue(null);

      if(event.criterio === 'estatus_id'){

        this.selectEstatus.readonly = false;
        this.inputAux.nativeElement.disabled = true;
        this.inputFechaInicio.nativeElement.readOnly = true;

      }else if(event.criterio === 'fecha_inicio_prog'){

        this.inputFechaInicio.nativeElement.readOnly = false;

      }else{

        this.palabra.enable();
        this.inputAux.nativeElement.disabled = false;
        this.selectEstatus.handleClearClick();
        this.selectEstatus.readonly = true;
        this.inputFechaInicio.nativeElement.readOnly = true;

      }
    }
  }

  loadEstatusCredito(){
    this.creditoEstatusService.getEstatus().subscribe( estatusCred => {
      this.estatus = estatusCred
    });
  }

  onChangeSelectEstatus(event:any){
    if(event){
      this.palabra?.setValue(event?.id);
    }
  }

  onChangeFechaInicio(event:any, inputFechaInicio:HTMLInputElement){
    if(event){
      this.palabra?.setValue(inputFechaInicio.value);
      this.fechaInicio = new Date(inputFechaInicio.value);
    }
  }

  onKeyUp(){
    this.palabra.setValue(this.inputAux.nativeElement.value);
  }

  limpiar() {
    this.filterForm.reset();
    this.fechaInicio = null;
    this.palabra?.setValue(null);
    this.inputFechaInicio.nativeElement.value = null;
    this.inputFechaInicio.nativeElement.readOnly = true;
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
