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
    { nombre: 'nombre', criterio: 'nombre' },
    { nombre: 'apellido paterno', criterio: 'apellido_paterno' },
    { nombre: 'apellido materno', criterio: 'apellido_materno' },
    { nombre: 'estatus', criterio: 'estatus_id'},
    { nombre: 'número de contrato', criterio: 'num_contrato' },
  ];

  //Estatus
  estatus: EstatusSolicitud[] = [];

  //Sort
  key = '';
  reverse: boolean = false;


  ngOnInit(): void {

    this.setPath();
    this.loadEstatusCredito();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.getCliente(params.id);
        this.getCreditosByClienteId(params.id);

      }

      this.subscription = this.creditoService.refresh$.subscribe(() => {
        this.getCreditosByClienteId(params.id);
      });

    });

    

  }

  getCliente(cliente_id:number){
    console.log(cliente_id);

    this.clienteService.getCliente(cliente_id).subscribe(res =>{
      this.cliente = res;
    })
  }

  getCreditosByClienteId(cliente_id:number){

    this.creditoService.getCreditos().subscribe( (creditos) => {

      this.creditos = creditos.filter(item => item.cliente_id == cliente_id); //unicamente créditos entregados

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
    //this.router.navigate(['dashboard/creditos/credito/view', credito.id]);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        user_id: credito.cliente_id
      }
    };
    
    this.router.navigate(['dashboard/clientes/credito/view', credito.id ], navigationExtras);
  }

  printAllDocumentation(credito:Credito) {
    this.creditoService.downloadAllDocumentation(credito);
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

      }else{

        this.palabra.enable();
        this.inputAux.nativeElement.disabled = false;
        this.selectEstatus.handleClearClick();
        this.selectEstatus.readonly = true;

      }
    }
  }

  loadEstatusCredito(){
    this.creditoEstatusService.getEstatus().subscribe( estatusCred => {
      console.log(estatusCred);
      this.estatus = estatusCred
    });
  }

  onChangeSelectEstatus(event:any){
    if(event){
      this.palabra?.setValue(event?.id);
    }
  }

  onKeyUp(){
    this.palabra.setValue(this.inputAux.nativeElement.value);
  }

  limpiar() {
    this.filterForm.reset();
    this.ngOnInit();
  }

  onClearSelectStatus(){
    this.palabra?.setValue(null);
  }

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  setPath() {
    this.pathService.path = '/dashboard/clientes';
  }

  get criterio() {
    return this.filterForm.get('criterio');
  }

  get palabra() {
    return this.filterForm.get('palabra');
  }

}
