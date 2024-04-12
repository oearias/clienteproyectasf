import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Solicitud } from '../../../interfaces/Solicitud';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SolEstatusService } from '../../../services/sol-estatus.service';
import { EstatusSolicitud } from '../../../interfaces/EstatusSolicitud';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-solicitudes-lista',
  templateUrl: './solicitudes-lista.component.html',
  styleUrls: ['./solicitudes-lista.component.css']
})
export class SolicitudesListaComponent implements OnInit {


  solicitudes: Solicitud[] = [];

  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;

  role: any;

  //Estatus
  estatus: EstatusSolicitud[] = [];
  reverse: boolean = false;

  allowedRoles = ['CREATOR', 'ADMIN','SuperAdmin'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solService: SolicitudesService,
    private solEstatusService: SolEstatusService,
    private toastr: ToastrService,
  ) {
    this.role = localStorage.getItem('role');
  }

  ngOnInit(): void {

    this.loadEstatusSolicitud();

    this.route.queryParams.subscribe(params => {

      this.getSolicitudes(this.currentPage);

      this.subscription = this.solService.refresh$.subscribe(() => {
        this.getSolicitudes(this.currentPage);
      });

      //Aquí mando un parámetro al metodo, para ver solo solicitudes filtradas
      // this.getSolicitudes(params.flag);

      // this.subscription = this.solService.refresh$.subscribe(() => {
      //   this.getSolicitudes(params.flag);
      // });

      

      

    })

  }

  getSolicitudes(page:number, limit: number = 10) {

    this.solService.getSolicitudesPaginadas(page, limit, this.busqueda).subscribe((solicitudes) =>{

      console.log(solicitudes.solicitudesJSON);

      this.solicitudes = solicitudes.solicitudesJSON;
      this.totalPages = solicitudes.totalPages;
      this.currentPage = solicitudes.currentPage;

    });

    // this.solService.getSolicitudesPaginadas(page, limit, this.busqueda).subscribe((res: any) => {

    //   const bandera = Number(param);

    //   if (this.role === 'EDITOR' || bandera === 1) {

    //     this.solicitudes = res.filter((solicitud: Solicitud) => solicitud.estatus_sol_id === 3);

    //   } else {
    //     this.solicitudes = res;
    //   }

    // });

  }

  generatePageRange(): number[] {

    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.getSolicitudes(page);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getSolicitudes(1);

  }

  createSolicitud() {
    this.router.navigateByUrl('dashboard/solicitudes/solicitud');
  }

  editSolicitud(solicitud: Solicitud) {
    this.router.navigate(['dashboard/solicitudes/solicitud', solicitud.id, 'flagEdit', true]);
  }

  deleteSolicitud(solicitud: Solicitud) {

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar <br>la solicitud <b>${solicitud.id}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.solService.deleteSolicitud(solicitud).subscribe((res: any) => {
          if (res) {

            this.toastr.success(res);

          }
        }, (err) => {

          Swal.fire({
            title: '¡Ups!',
            html: `No es posible eliminar el registro. ${err.error.msg} <b>${err.error?.tabla}</b>`,
            icon: 'warning'
          });
        });

      }
    });
  }

  viewSolicitud(solicitud: Solicitud) {
    this.router.navigate(['dashboard/solicitudes/solicitud/view', solicitud.id])
  }


  loadEstatusSolicitud() {
    this.solEstatusService.getEstatus().subscribe(estatusSol => {
      this.estatus = estatusSol
    });
  }

  goPresupuesto() {
    this.router.navigate(['dashboard/solicitudes/presupuesto']);
  }


}
