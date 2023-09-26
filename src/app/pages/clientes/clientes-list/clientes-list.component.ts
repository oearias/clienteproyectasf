import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/Cliente';
import { Subscription, BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  data: any;

  clientes: Cliente[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  })

  subscription: Subscription;

  //Paginate
  p: number = 1;
  itemsPP: number = 10;
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
    { nombre: 'nombre', criterio: 'nombre_completo' },
    { nombre: 'apellido paterno', criterio: 'nombre_completo' },
    { nombre: 'apellido materno', criterio: 'nombre_completo' },
    { nombre: 'número de cliente', criterio: 'num_cliente' },
    { nombre: 'zona', criterio: 'zona' },
    { nombre: 'agencia', criterio: 'agencia' },
  ];

  //Sort
  key = 'id';
  reverse: boolean = false;

  constructor(
    private clienteService: ClientesService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm.setValue({
      criterio: null,
      palabra: null
    })
  }

  ngOnInit(): void {

    this.getClientes();

    this.subscription = this.clienteService.refresh$.subscribe(() => {
      this.getClientes();
    });

  }

  getClientes() {
    this.clienteService.getClientes().subscribe((res: any) => {

      this.clientes = res;

    });
  }

  createCliente() {
    this.router.navigateByUrl('dashboard/clientes/cliente');
  }

  editCliente(cliente: Cliente) {
    this.router.navigate(['dashboard/clientes/cliente', cliente.id]);
  }

  deleteCliente(cliente: Cliente){

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${cliente.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.deleteCliente(cliente).subscribe( (res:any) => {
          if(res){

            // Swal.fire(
            //   '¡Eliminado!',
            //   'El registro ha sido eliminado',
            //   'success'
            // );
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

  viewContractsByCliente(cliente:Cliente){
    this.router.navigate(['dashboard/clientes/creditos/cliente', cliente.id]);
  }

  cambiaItems(event:any) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.clienteService.getClientesByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.clientes = res;
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
