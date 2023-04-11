import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { PathService } from '../../../services/path.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { CreditosService } from '../../../services/creditos.service';
import { Credito } from '../../../interfaces/Credito';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-creditos-masivos',
  templateUrl: './creditos-masivos.component.html',
  styleUrls: ['./creditos-masivos.component.css']
})
export class CreditosMasivosComponent implements OnInit {

  @ViewChild('inputFechaEntrega') inputFechaEntrega: ElementRef;

  subscription: Subscription;
  creditos: Credito[] = [];

  arrayToSend = [];
  arrayInicial = [];

  constructor(
    private creditoService: CreditosService,
    private pathService: PathService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setPath();
    this.getCreditos();

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getCreditos();
    })
  }

  getCreditos() {

    this.arrayInicial = [];

    this.creditoService.getCreditos().subscribe(creditos => {

      this.creditos = creditos.map((item: any) => {

        
        //Creditos aprobados para entrega
        if (item.preaprobado === 1) {

          if (item.fecha_entrega_prog != null) {
            item.fecha_entrega_prog = this.formatFecha(item.fecha_entrega_prog);
          }

          if (item.fecha_inicio_prog != null) {
            item.fecha_inicio_prog = this.formatFecha(item.fecha_inicio_prog);
          }


          if (item.motivo === null) {
            item.isChecked = false;
          } else {
            item.isChecked = true;
          }

          this.addToArrayInicial(item.id, item.fecha_entrega_prog, item.hora_entrega, item.fecha_inicio_prog, item.num_cheque, item.entregado, item.no_entregado, item.motivo, item.num_semanas);

          console.log(item);


          return item;
        }
      }).filter(item => item);
    });


  }

  onChangeFechaInicio(credito: Credito, fechaEntrega: HTMLInputElement, fechaInicio: HTMLInputElement) {

    let esMartes = this.detectWhatDayIs(fechaInicio.value);

    if (esMartes != 1) {

      fechaInicio.value = null;

      Swal.fire({
        title: 'Fecha de inicio no válida',
        html: `La fecha de inicio del crédito tiene que ser día martes obligatoriamente`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });
    }

    //Detectamos la fecha de entrega
    if (fechaEntrega.value > fechaInicio.value && fechaInicio.value.length > 0) {

      fechaInicio.value = null;

      Swal.fire({
        title: 'Fecha de entrega no válida',
        html: `La fecha de entrega del crédito no puede ser mayor que la fecha de inicio`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });

    } else {
      let element = this.arrayInicial.find(element => element.credito_id === credito.id);
      element['fecha_inicio'] = fechaInicio.value;
    }

  }

  onChangeFechaEntrega(credito: Credito, fechaEntrega: HTMLInputElement, fechaInicio: HTMLInputElement) {

    //Detectamos la fecha de entrega
    if ((fechaEntrega.value > fechaInicio.value) && fechaInicio.value.length > 0) {

      fechaEntrega.value = null;

      Swal.fire({
        title: 'Fecha de entrega no válida',
        html: `La fecha de entrega del crédito no puede ser mayor que la fecha de inicio`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });
    } else {

      let element = this.arrayInicial.find(element => element.credito_id === credito.id);
      element['fecha_entrega'] = fechaEntrega.value;

    }

  }

  onChangeHoraEntrega(credito: Credito, horaEntrega: HTMLInputElement){

    let element = this.arrayInicial.find(element => element.credito_id === credito.id);
    element['hora_entrega'] = horaEntrega.value;


  }

  onChangeNumCheque(event: any, credito: Credito) {

    let element = this.arrayInicial.find(element => element.credito_id === credito.id);
    element['num_cheque'] = event.target.value;


  }

  onChangeMotivo({ target: { value } }, credito: Credito) {

    let element = this.arrayInicial.find(element => element.credito_id === credito.id);
    element['motivo'] = value;

  }

  onCheckEntregado({ target: { checked } }, credito: Credito, fechaEntrega: HTMLInputElement, fechaInicio: HTMLInputElement, numCheque: HTMLInputElement, horaEntrega: HTMLInputElement, entregado:HTMLInputElement, noEntregado: HTMLInputElement, motivo: HTMLInputElement) {

    //Validamos que estén llenas las fechas y el cheque
    if (fechaEntrega.value != null && fechaEntrega.value.length > 0 && fechaInicio.value != null && fechaInicio.value.length > 0 && numCheque.value != null && numCheque.value.length > 0  && horaEntrega.value != null && horaEntrega.value.length > 0) {

      let element = this.arrayInicial.find(element => element.credito_id === credito.id);

      if (checked === true) {
        element['entregado'] = 1;
        noEntregado.checked = false;
        motivo.readOnly = true;
      } else {
        element['entregado'] = 0;
      }

    } else {

      entregado.checked = null;
      
      Swal.fire({
        title: 'Llenemos algunos datos',
        html: `Para poder marcar como entregado este crédito es necesario ingresar fecha de entrega, hora de entrega, fecha de inicio y número de cheque`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });
    }


  }

  onCheckNoEntregado({ target: { checked } }, credito: Credito, entregado: HTMLInputElement, motivo: HTMLInputElement) {
    let element = this.arrayInicial.find(element => element.credito_id === credito.id);

    checked
      ? (
        element['no_entregado'] = 1,
        motivo.readOnly = false,
        entregado.checked = false)
      : (
        motivo.readOnly = true,
        element['no_entregado'] = 0
      )

  }


  addToArrayInicial(id: any, fechaEntrega: any, horaEntrega:any, fechaInicio: any, num_cheque: any, entregado: any, no_entregado: any, motivo: any, num_semanas:any) {
    this.arrayInicial.push(
      {
        credito_id: id,
        fecha_entrega: fechaEntrega,
        hora_entrega: horaEntrega,
        fecha_inicio: fechaInicio,
        num_cheque,
        entregado,
        no_entregado,
        motivo,
        num_semanas
      });

  }

  changeStatus() {

    this.creditoService.updateFechaCreditosMasivos(this.arrayInicial).subscribe( (res:any) => {

      console.log(this.arrayInicial);

      this.toastr.success(res);
    }, (err)=> {

      this.toastr.error(err.error);

    });
  }

  printFormatoEntregasCredito(){

    if(this.inputFechaEntrega.nativeElement.value.length > 0){

      let fechaParam = this.inputFechaEntrega.nativeElement.value;

      // fechaParam = this.formatFecha(fechaParam);

      // console.log(fechaParam);

      // console.log(typeof fechaParam);

      this.creditoService.downloadEntregasCredito(fechaParam);
    
    }else{
      Swal.fire({
        title: 'Llenemos algunos datos',
        html: `Para poder generar el reporte es necesario ingresar la fecha de entrega como parámetro situada al lado izquierdo de este botón`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });
    }
  }

  detectWhatDayIs(fecha: any) {

    let whatday = new Date(fecha);

    return whatday.getDay();
  }

  formatFecha(date: Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  setPath() {
    this.pathService.path = '/dashboard/creditos';
  }

}
