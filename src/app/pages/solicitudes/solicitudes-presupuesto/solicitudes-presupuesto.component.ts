import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { PathService } from '../../../services/path.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitudes-presupuesto',
  templateUrl: './solicitudes-presupuesto.component.html',
  styleUrls: ['./solicitudes-presupuesto.component.css']
})
export class SolicitudesPresupuestoComponent implements OnInit {

  subscription: Subscription;
  solicitudes: Solicitud[] = [];
  solicitudes_presupuesto: Solicitud[] = [];
  monto_sol_checked: number = 0;
  total: number = 0;

  arrayToSend: number[] = [];

  constructor(
    private pathService: PathService,
    private solService: SolicitudesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.setPath();
    this.getSolicitudes();

    this.subscription = this.solService.refresh$.subscribe(() => {
      this.getSolicitudes();
    })

  }

  getSolicitudes() {

    // this.solService.getSolicitudes().subscribe(solicitudes => {
    //   this.solicitudes = solicitudes.map(item => {
    //     if (item.estatus_sol_id === 6) {
    //       this.total += Number(item.monto);
    //       return item;
    //     }
    //   }).filter(item => item);
    // });

    this.solService.getSolicitudesParaPresupuesto().subscribe( (res) => {

      console.log('entramos a las solicitudes para presupuesto');


      this.solicitudes = res.solicitudesJSON;

      this.solicitudes.map(item =>{

        this.total += Number(item.monto);

      });



    });




  }

  onCheck(event: any, sol: Solicitud) {

    if (event.target.checked === true) {
      this.monto_sol_checked = Number(this.monto_sol_checked) + Number(sol.monto);
      this.addToArray(sol.id);

    } else {
      this.monto_sol_checked = Number(this.monto_sol_checked) - Number(sol.monto);
      this.removeToArray(sol.id);
    }
  }

  setPath() {
    this.pathService.path = '/dashboard/';
  }

  addToArray(valor: number) {
    this.arrayToSend.push(valor);
  }

  removeToArray(valor: number) {
    for (let i = 0; i < this.arrayToSend.length; i++) {
      if (this.arrayToSend[i] === valor) {
        this.arrayToSend.splice(i, 1);
        i--;
      }
    }
  }

  changeStatus() {
    
    this.solService.updateSolicitudEstatus(this.arrayToSend).subscribe((res: any) => {

      if (res) {

        this.arrayToSend = [];
        this.toastr.success(res);

        this.monto_sol_checked = 0;
        this.total = 0;

      }

    })
  }

}
