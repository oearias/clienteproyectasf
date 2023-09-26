import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Credito } from 'src/app/interfaces/Credito';
import { EstatusSolicitud } from 'src/app/interfaces/EstatusSolicitud';
import { CreditoEstatusService } from 'src/app/services/credito-estatus.service';
import { CreditosService } from 'src/app/services/creditos.service';
import { PathService } from 'src/app/services/path.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/interfaces/Cliente';

@Component({
  selector: 'app-view-contracts',
  templateUrl: './view-contracts.component.html',
  styleUrls: ['./view-contracts.component.css']
})
export class ViewContractsComponent implements OnInit {

  @ViewChild('selectEstatus') selectEstatus: NgSelectComponent;
  @ViewChild('inputAux') inputAux: ElementRef;

  constructor(
    private pathService: PathService,
    private clienteService: ClientesService,
    private creditoEstatusService: CreditoEstatusService,
    private creditoService: CreditosService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  creditos: Credito[] = [];
  cliente: Cliente;

  currentPage: number = 1; // Inicializa currentPage con 1 por defecto
  totalPages: number = 1; // Inicializa totalPages con 1 por defecto

  busqueda = '';

  subscription: Subscription;


  //Estatus
  estatus: EstatusSolicitud[] = [];


  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.getCliente(params.id);

        this.getCreditos(this.currentPage, 10, params.id);

      }

      this.subscription = this.creditoService.refresh$.subscribe(() => {
        this.getCreditos(this.currentPage, 10, params.id);
      });

    });

    

  }

  getCliente(cliente_id:number){

    this.clienteService.getCliente(cliente_id).subscribe(res =>{
      this.cliente = res;
    })
  }

  getCreditos(page:number, limit: number = 10, cliente_id:number){

    this.creditoService.getCreditosByClienteId(page, limit, this.busqueda, cliente_id).subscribe( (creditos) => {

      this.creditos = creditos.creditosJSON;
      this.totalPages = creditos.totalPages;
      this.currentPage = creditos.currentPage;

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
      this.getCreditos(page, 10, this.cliente.id);
    }
  }

  goToFirstPage(): void {
    if (this.totalPages > 1 && this.currentPage !== 1) {
      this.goToPage(1);
    }
  }

  buscarElementos(terminoBusqueda: string) {

    this.busqueda = terminoBusqueda;
    this.getCreditos(1, 10, this.cliente.id);

  }

  createCredito() {
    this.router.navigateByUrl('dashboard/creditos2/credito');
  }

  editCredito(credito: Credito) {
    this.router.navigate(['dashboard/creditos2/credito', credito.id]);
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
    //this.router.navigate(['dashboard/creditos/credito/view', credito.id]);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        user_id: this.cliente.id
      }
    };
    
    this.router.navigate(['dashboard/clientes2/credito/view', credito.id ], navigationExtras);
  }

  printAllDocumentation(credito:Credito) {
    this.creditoService.downloadAllDocumentation(credito);
  }

  goCreateCreditos(){
    this.router.navigate(['dashboard/creditos2/createCreditos'])
  }

  setPath() {
    this.pathService.path = '/dashboard/clientes2';
  }



}
