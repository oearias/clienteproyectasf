import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Monto } from 'src/app/interfaces/Monto';
import { MontosService } from 'src/app/services/montos.service';

@Component({
  selector: 'app-montos-list',
  templateUrl: './montos-list.component.html',
  styleUrls: ['./montos-list.component.css']
})
export class MontosListComponent implements OnInit {

  montos: Monto[] = [];

  //Formulario del filtro
  filterForm = this.fb.group({
    criterio: new FormControl(null, Validators.required),
    palabra: new FormControl(null, Validators.required)
  });

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
    { nombre: 'nombre', criterio: 'a.nombre' },
    { nombre: 'sucursal', criterio: 'b.nombre' },
  ];

  //Sort
  key = 'nombre';
  reverse: boolean = false;

  constructor(
    private montoService: MontosService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getMontos();

    this.subscription = this.montoService.refresh$.subscribe(() => {
      this.getMontos();
    });
  }

  getMontos() {
    this.montoService.getMontos().subscribe((res: any) => {

      this.montos = res;

    });
  }

  createMonto() {
    this.router.navigateByUrl('catalogos/montos/monto');
  }

  editMonto(monto: Monto) {
    this.router.navigate(['catalogos/montos/monto', monto.id]);
  }

  deleteMonto(monto: Monto){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${monto.monto}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.montoService.deleteMonto(monto).subscribe( (res:any) => {
          if(res){

            this.toastr.success(res);

          }
        })

        
      }
    });
  }

  cambiaItems(event) {
    this.itemsPP = event.cant
  }

  search() {

    if (this.filterForm.valid) {
      this.montoService.getMontosByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.montos = res;
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
