import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EstatusSolicitud } from 'src/app/interfaces/EstatusSolicitud';
import { Solicitud } from 'src/app/interfaces/Solicitud';
import { SolEstatusService } from 'src/app/services/sol-estatus.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-modificar-lista',
  templateUrl: './solicitudes-modificar-lista.component.html',
  styleUrls: ['./solicitudes-modificar-lista.component.css']
})
export class SolicitudesModificarListaComponent implements OnInit {

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
      

    })

  }


  getSolicitudes(page:number, limit: number = 10) {

    this.solService.getSolicitudesPorModificar(page, limit, this.busqueda).subscribe((solicitudes) =>{

      console.log(solicitudes.solicitudesJSON);

      this.solicitudes = solicitudes.solicitudesJSON;
      this.totalPages = solicitudes.totalPages;
      this.currentPage = solicitudes.currentPage;

    });

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
