import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pago } from 'src/app/interfaces/Pago';
import { PagosService } from 'src/app/services/pagos.service';
import { WeeksyearService } from 'src/app/services/weeksyear.service';
import { CreditosService } from '../../../services/creditos.service';
import { PathService } from '../../../services/path.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pago-view',
  templateUrl: './pago-view.component.html',
  styleUrls: ['./pago-view.component.css']
})
export class PagoViewComponent implements OnInit {

  @ViewChild('inputHora') inputHora: ElementRef;
  @ViewChild('inputFolio') inputFolio: ElementRef;

  creditos = [];
  weeksyear = [];

  pagoForm = this.fb.group({
    id: new FormControl(null),
    num_contrato: new FormControl(null),
    credito_id: new FormControl(null, Validators.required),
    fecha: new FormControl(null, Validators.required),
    hora: new FormControl(null, Validators.required),
    metodo_pago: new FormControl(null, Validators.required),
    monto: new FormControl(null, Validators.required),
    weekyear: new FormControl(null, Validators.required),
    observaciones: new FormControl(null)
  });

  editingPago: Pago;

  metodosPago = [
    {nombre:'EFECTIVO'},
    {nombre:'TRANSFERENCIA / DEPÓSITO'},
  ]

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private pagoService: PagosService,
    private creditoService: CreditosService,
    private weeksyearService: WeeksyearService,
  ) { 
    this.pagoForm.setValue({
      id: null,
      num_contrato: null,
      credito_id: null,
      fecha: null,
      hora: null,
      metodo_pago: null,
      monto: null,
      observaciones: null,
      weekyear: null
    });
  }

  ngOnInit(): void {
    
    this.setPath();
    

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.pagoService.getPago(params.id).subscribe(res => {

          this.editingPago = res;

          this.loadData(params.id);

          this.id?.setValue(this.editingPago?.id);
          this.credito_id?.setValue(this.editingPago?.credito_id);
          this.num_contrato?.setValue(this.editingPago?.num_contrato);
          this.monto?.setValue(this.editingPago?.monto);
          this.fecha?.setValue(this.datePipe.transform(this.editingPago?.fecha, 'yyyy-MM-dd','0+100'));
          this.hora?.setValue(this.editingPago?.hora);
          this.metodo_pago?.setValue(this.editingPago?.metodo_pago);
          this.weekyear?.setValue(this.editingPago?.weekyear);
          this.observaciones?.setValue(this.editingPago?.observaciones);

          this.inputFolio.nativeElement.value = this.editingPago?.folio

        });

        this.pagoForm.disable();

      }
    });
  }

  loadData(pago_id:number){
    this.loadCreditos(pago_id);
    this.loadSemanas();
  }

  loadCreditos(pago_id:number){

    this.pagoService.getCreditoByPagoId(pago_id).subscribe( creditos => {

      this.creditos = creditos.creditosJSON;

    })
  }

  loadSemanas(){
    this.weeksyearService.getSemanas().subscribe( (semanas:any) => {
      this.weeksyear = semanas;
    });
  }

  onChangeCredito(event:any){
  }

  onChangeMetodoPago(event: any){

    if(event){
      if(event.nombre != 'EFECTIVO'){
        this.inputHora.nativeElement.readOnly = false;
        this.hora.setValue(null);
      }else{
        this.inputHora.nativeElement.readOnly = true;
        this.hora.setValue('00:00');
      }
    }
  }

  volver() {
    this.router.navigate(['/dashboard/pagos2']);
  }

  setPath(){
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

  get fecha() {
    return this.pagoForm.get('fecha');
  }

  get hora() {
    return this.pagoForm.get('hora');
  }

  get observaciones() {
    return this.pagoForm.get('observaciones');
  }

  get metodo_pago() {
    return this.pagoForm.get('metodo_pago');
  }

  get weekyear() {
    return this.pagoForm.get('weekyear');
  }

}
