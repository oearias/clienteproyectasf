import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Credito } from 'src/app/interfaces/Credito';
import { CreditosService } from 'src/app/services/creditos.service';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-creditos-check-entregados',
  templateUrl: './creditos-check-entregados.component.html',
  styleUrls: ['./creditos-check-entregados.component.css']
})
export class CreditosCheckEntregadosComponent implements OnInit {

  subscription: Subscription;
  creditos: Credito[] = [];

  arrayToSend = [];
  arrayInicial = [];

  arrayToPrint = [];
  totalContratosToPrint = 0;

  selectAllCheckbox = false;
  readonlyMode: boolean = true;

  busqueda = '';
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private datePipe: DatePipe,
    private creditoService: CreditosService,
    private pathService: PathService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setPath();
    this.getCreditos(this.currentPage);

    this.subscription = this.creditoService.refresh$.subscribe(() => {
      this.getCreditos(this.currentPage);
    });
  }

  getCreditos(page:number, limit:number = 100, fechaParam?: Date) {

    this.arrayInicial = [];
    this.arrayToPrint = [];

    this.creditoService.getCreditosProgramacionEntrega(page, limit, this.busqueda).subscribe(creditos => {

      this.creditos = creditos.creditosJSON
        //Desaparemos los creditos no entregados
        .filter(item => item.no_entregado != 1)
        .filter(item => item.fecha_entrega_prog!= null && item.hora_entrega != null && item.num_cheque!=null )
        //Filtramos los creditos visualmente si hay una fecha de entrega específica
        .filter(item => !fechaParam || new Date(item.fecha_entrega_prog).toISOString().slice(0, 10) === new Date(fechaParam).toISOString().slice(0, 10))
        .map((item: any) => {


            if (item.fecha_entrega_prog != null) {
              item.fecha_entrega_prog = this.datePipe.transform(item.fecha_entrega_prog, 'yyyy-MM-dd', '0+100');
            }

            if (item.fecha_inicio_prog != null) {
              item.fecha_inicio_prog = this.datePipe.transform(item.fecha_inicio_prog, 'yyyy-MM-dd', '0+100');
            }


            if (item.motivo === null) {
              item.isChecked = false;
            } else {
              item.isChecked = true;
            }

            item.printSelected = false;

            this.addToArrayInicial(item.id, item.fecha_entrega_prog, item.hora_entrega, item.fecha_inicio_prog, item.num_cheque, item.entregado, item.no_entregado, item.motivo, item.num_semanas);
            this.addToArrayToPrint(item.id, item.printSelected, item.fecha_inicio_prog);

            return item;
          

        })
        .filter((item: any) => item);
    });

    // this.creditoService.getCreditos().subscribe(creditos => {

    //   this.creditos = creditos
    //     //Desaparemos los creditos no entregados
    //     .filter(item => item.no_entregado != 1)
    //     .filter(item => item.fecha_entrega_prog!= null && item.hora_entrega != null && item.num_cheque!=null )
    //     //Filtramos los creditos visualmente si hay una fecha de entrega específica
    //     .filter(item => !fechaParam || new Date(item.fecha_entrega_prog).toISOString().slice(0, 10) === new Date(fechaParam).toISOString().slice(0, 10))
    //     .map((item: any) => {

    //       //Creditos aprobados para entrega
    //       if (item.preaprobado === 1) {

    //         if (item.fecha_entrega_prog != null) {
    //           item.fecha_entrega_prog = this.datePipe.transform(item.fecha_entrega_prog, 'yyyy-MM-dd', '0+100');
    //         }

    //         if (item.fecha_inicio_prog != null) {
    //           item.fecha_inicio_prog = this.datePipe.transform(item.fecha_inicio_prog, 'yyyy-MM-dd', '0+100');
    //         }


    //         if (item.motivo === null) {
    //           item.isChecked = false;
    //         } else {
    //           item.isChecked = true;
    //         }

    //         item.printSelected = false;

    //         this.addToArrayInicial(item.id, item.fecha_entrega_prog, item.hora_entrega, item.fecha_inicio_prog, item.num_cheque, item.entregado, item.no_entregado, item.motivo, item.num_semanas);
    //         this.addToArrayToPrint(item.id, item.printSelected, item.fecha_inicio_prog);

    //         return item;
    //       }

    //     })
    //     .filter((item: any) => item);
    // });


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
    if ((fechaEntrega.value > fechaInicio.value) && (fechaInicio.value.length > 0)) {

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

  onChangeHoraEntrega(credito: Credito, horaEntrega: HTMLInputElement) {

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

  onCheckEntregado({ target: { checked } }, credito: Credito, fechaEntrega: HTMLInputElement, fechaInicio: HTMLInputElement, numCheque: HTMLInputElement, horaEntrega: HTMLInputElement, entregado: HTMLInputElement, noEntregado: HTMLInputElement, motivo: HTMLInputElement) {

    //Validamos que estén llenas las fechas y el cheque
    if (fechaEntrega.value != null && fechaEntrega.value.length > 0 && fechaInicio.value != null && fechaInicio.value.length > 0 && numCheque.value != null && numCheque.value.length > 0 && horaEntrega.value != null && horaEntrega.value.length > 0) {

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

  onCheckContrato({ target: { checked } }, credito: Credito) {

    this.updateArrayToPrint(credito.id, checked);

    const totalSeleccionados = this.arrayToPrint.filter(item => item.printSelected === true).length;


    if (totalSeleccionados < 1) {
      console.log('total seleccionados', totalSeleccionados);
      this.selectAllCheckbox = false;

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

  addToArrayInicial(id: any, fechaEntrega: any, horaEntrega: any, fechaInicio: any, num_cheque: any, entregado: any, no_entregado: any, motivo: any, num_semanas: any) {
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

  addToArrayToPrint(id: number, flag: boolean, fechaInicio) {

    this.arrayToPrint.push({
      credito_id: id,
      printSelected: flag,
      fecha_inicio: fechaInicio
    });

  }

  tieneFechaInicio(arreglo: Array<any>): boolean {

    for (let i = 0; i < arreglo.length; i++) {

      if (arreglo[i].fecha_inicio === null) {
        return false;
      }

    }

    return true;
  }

  updateArrayToPrint(id: number, flag: boolean) {

    const index = this.arrayToPrint.findIndex(item => item.credito_id === id);
    if (index !== -1) {
      this.arrayToPrint[index].printSelected = flag;
    }

    this.totalContratosToPrint = this.arrayToPrint.filter(item => item.printSelected === true).length;

  }

  changeStatus() {

    this.creditoService.updateFechaCreditosMasivos(this.arrayInicial).subscribe((res: any) => {

      this.toastr.success(res);
    }, (err) => {

      this.toastr.error(err.error);

    });
  }

  toggleSelectAllCheckbox(isChecked: boolean) {

    this.creditos = this.creditos
      .map(credito => ({ ...credito, printSelected: isChecked }));

    this.creditos.forEach((item: any) => this.updateArrayToPrint(item.id, isChecked));

    this.totalContratosToPrint = this.arrayToPrint.filter(item => item.printSelected === true).length;


  }

  printContratos() {

    if (this.arrayToPrint.length > 0) {


      //Validamos que todos los contratos tengan fecha_inicio
      const tieneFecha = this.tieneFechaInicio(this.arrayToPrint.filter(item => item.printSelected));


      if (tieneFecha === false) {
        Swal.fire({
          title: 'Llenemos algunos datos',
          html: `Para poder imprimir los contratos seleccionados es necesario que tengan guardada la fecha de inicio cada uno de ellos.`,
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#2f5ade',
          confirmButtonText: '¡Entendido!'
        });
      } else {


        this.creditoService.printContratosMasivos(this.arrayToPrint);

      }



    } else {

      Swal.fire({
        title: 'Llenemos algunos datos',
        html: `Para poder imprimir contratos es necesario seleccionar al menos un crédito en la casilla izquierda`,
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#2f5ade',
        confirmButtonText: '¡Entendido!'
      });

    }

    //Para imprimir contratos es necesario seleccionar al menos un credito en la casilla de la izq.
  }

  detectWhatDayIs(fecha: any) {

    let whatday = new Date(fecha);

    return whatday.getDay();
  }

  setPath() {
    this.pathService.path = '/dashboard/';
  }

}
