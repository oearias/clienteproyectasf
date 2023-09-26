import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { PagosService } from 'src/app/services/pagos.service';
import { Pago } from '../../../interfaces/Pago';
import { CreditosService } from '../../../services/creditos.service';
import { WeeksyearService } from '../../../services/weeksyear.service';
import { PathService } from '../../../services/path.service';
import { Credito } from 'src/app/interfaces/Credito';
import { SemanasService } from '../../../services/semanas.service';
import { Semana } from 'src/app/interfaces/Semana';
import { filter } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  @ViewChild('inputHora') inputHora: ElementRef;
  @ViewChild('selectWeekyear') selectWeekyear: ElementRef;
  @ViewChild('selectWeekyear') selectWeekyearNg: NgSelectComponent;
  @ViewChild('selectCredito') selectCredito: NgSelectComponent;
  @ViewChild('inputZona') inputZona: ElementRef;
  @ViewChild('inputAgencia') inputAgencia: ElementRef;

  creditos: Credito[] = [];
  pruebas = [];
  creditosArray: Credito[] = [];
  //weeksyear = [];
  semanas: Semana[] = [];
  semanaOpened: Semana;

  readonlyMode: boolean = false;

  pagoForm = this.fb.group({
    id: new FormControl(null),
    num_contrato: new FormControl(null),
    credito_id: new FormControl(null, Validators.required),
    metodo_pago: new FormControl(null),
    folio: new FormControl(null, Validators.required),
    fecha: new FormControl(null, Validators.required),
    hora: new FormControl(null),
    monto: new FormControl(null, Validators.required),
    weekyear: new FormControl(null, Validators.required),
    weekyear2: new FormControl(null),
    observaciones: new FormControl(null)
  });

  editingPago: Pago;
  creditoSelected: Credito;

  metodosPago = [
    { nombre: 'EFECTIVO' },
    { nombre: 'TRANSFERENCIA / DEPÓSITO' },
  ]

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagoService: PagosService,
    private creditoService: CreditosService,
    private semanaService: SemanasService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.pagoForm.setValue({
      id: null,
      num_contrato: null,
      credito_id: null,
      metodo_pago: 'EFECTIVO',
      folio: null,
      fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      hora: '00:00',
      monto: null,
      weekyear: null,
      weekyear2: null,
      observaciones: null
    });

  }

  busqueda = '';

  ngOnInit(): void {

    this.setPath();
    this.loadData();
    //this.weekyear2.disable();


    this.route.params.subscribe((params) => {

      if (params.id) {

        forkJoin([
          this.pagoService.getPago(params.id),
          this.creditoService.getCreditos(),
        ]).subscribe((results: [Pago, Credito[]]) => {

          this.editingPago = results[0];

          console.log(results[1]);

          this.creditos = results[1]
            .map((credito) => {
              credito.nombre = `${credito.num_contrato} | ${credito.num_cliente} | ${credito.apellido_paterno} ${credito.apellido_materno} ${credito.nombre}`
              return credito;
            });

          this.creditosArray = this.creditos;

          this.id?.setValue(this.editingPago?.id);
          this.credito_id?.setValue(this.editingPago?.credito_id);
          this.folio.setValue(this.editingPago?.folio);
          this.monto?.setValue(this.editingPago?.monto);
          this.fecha?.setValue(this.datePipe.transform(this.editingPago?.fecha, 'yyyy-MM-dd', '0+100'));
          this.observaciones?.setValue(this.editingPago?.observaciones);
          this.num_contrato?.setValue(this.editingPago?.num_contrato);

          // Ponemos modo lectura los controles
          this.readonlyMode = true;
          this.selectCredito.readonly = true;
          this.selectWeekyearNg.readonly = true;

        });

      }
    });

  }

  confirmPago() {

    this.savePago();

    // let verbo;

    // if (this.id.value > 0) {
    //   verbo = 'Cancelar';
    // } else {
    //   verbo = 'Ingresar'
    // }

    // Swal.fire({
    //   title: `${verbo} pago`,
    //   html: `¿Está ud. seguro que desea ${verbo} el pago <br>por la cantidad de: <b>$${this.monto.value}</b> <br>al Crédito n. <b>${this.num_contrato.value}</b> <br>con fecha: <b>${this.fecha.value}</b>?`,
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: '#2f5ade',
    //   cancelButtonColor: '#d33',
    //   cancelButtonText: 'Cancelar',
    //   confirmButtonText: `Si, ${verbo}!`,
    //   confirmButtonAriaLabel: 'send'
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.savePago();

    //   }
    // });
  }

  savePago() {

    if (this.pagoForm.valid) {

      if (this.pagoForm.value.id != null) {

        //Preguntamos que haya observaciones
        if (!this.observaciones.value) {

          Swal.fire({
            title: 'Ups! Faltan algunos datos',
            html: `Por favor establezca en el campo de observaciones un motivo para cancelar el pago`,
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#2f5ade',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok, Entiendo!',
            confirmButtonAriaLabel: 'send'
          });


        } else {


          this.pagoService.updatePago(this.pagoForm.value).subscribe((res: any) => {


            this.toastr.success(res);

          });

          this.router.navigateByUrl('/dashboard/pagos');

        }


      } else {

        this.pagoService.insertPago(this.pagoForm.value).subscribe((res: any) => {

          this.resetForm();
          this.toastr.success(res);

        }, (err) => {

          this.toastr.error(err.error);

        });

        //this.router.navigateByUrl('/dashboard/pagos');

      }



    }
  }

  resetForm() {

    this.creditoSelected = null;
    this.credito_id.setValue(null);
    this.monto.setValue(null);
    this.folio.setValue(null);

  }

  onChangeCredito(event: any) {

    this.creditoSelected = null;

    if (event) {

      console.log(event);

      this.num_contrato?.setValue(event.num_contrato);

      //a manera de prueba vamos a localizar el crédito aqui
      // this.creditoService.getCredito(this.credito_id.value).subscribe(res => {
      //   this.creditoSelected = res
      // });

      //this.creditoSelected = this.creditosArray.find((item) => item.id === this.credito_id.value);

      this.inputZona.nativeElement.value = event.zona;
      this.inputAgencia.nativeElement.value = event.agencia;

      // this.inputZona.nativeElement.value = this.creditoSelected?.zona;
      // this.inputAgencia.nativeElement.value = this.creditoSelected?.agencia;

    }

  }

  onChangeMetodoPago(event: any) {

    if (event) {
      if (event.nombre != 'EFECTIVO') {
        this.inputHora.nativeElement.readOnly = false;
        this.hora.setValue(null);
      } else {
        this.inputHora.nativeElement.readOnly = true;
        this.hora.setValue('00:00');
      }
    }
  }

  loadData() {
    this.loadCreditos();
    this.loadSemanas();
  }

  loadCreditos() {

    this.creditoService.getCreditosLimitados(this.busqueda).subscribe(creditos => {

      this.pruebas = creditos.creditosJSON;

      //this.creditos = creditos;

      //this.creditosArray = this.creditos;
    });
  }

  buscarElementos(terminoBusqueda: any) {

    this.busqueda = terminoBusqueda.term;

    this.loadCreditos();

  }

  clearSelectCreditos() {
    this.busqueda='';
    this.inputZona.nativeElement.value = '';
    this.inputAgencia.nativeElement.value = '';

    this.loadCreditos();
  }

  loadSemanas() {

    this.semanaService.getSemanas().subscribe(semanas => {

      this.semanas = semanas
        .filter(item => item.estatus)

      this.semanaOpened = semanas.find(item => item.estatus);

      this.weekyear.setValue(this.semanaOpened?.weekyear);
      this.weekyear2.setValue(this.semanaOpened?.weekyear);

    });

  }

  volver() {
    this.router.navigate(['/dashboard/pagos2']);
  }

  setPath() {
    this.pathService.path = '/dashboard/pagos2';
  }

  //Getters
  get id() {
    return this.pagoForm.get('id');
  }

  get credito_id() {
    return this.pagoForm.get('credito_id');
  }

  get num_contrato() {
    return this.pagoForm.get('num_contrato');
  }

  get monto() {
    return this.pagoForm.get('monto');
  }

  get folio() {
    return this.pagoForm.get('folio');
  }

  get fecha() {
    return this.pagoForm.get('fecha');
  }

  get hora() {
    return this.pagoForm.get('hora');
  }

  get observaciones() {
    return this.pagoForm.get('observaciones');
  }

  get weekyear() {
    return this.pagoForm.get('weekyear');
  }

  get weekyear2() {
    return this.pagoForm.get('weekyear2');
  }

}
