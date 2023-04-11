import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ZonasService } from '../../../services/zonas.service';
import { Zona } from '../../../interfaces/Zona';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-zonas-list',
  templateUrl: './zonas-list.component.html',
  styleUrls: ['./zonas-list.component.css']
})
export class ZonasListComponent implements OnInit {

  zonas: Zona[] = [];

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
    private zonaService: ZonasService,
    private router: Router,
    public modalService: ModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { 
    this.filterForm.setValue({
      criterio: null,
      palabra: null
    });
  }

  ngOnInit(): void {
    this.getZonas();

    this.subscription = this.zonaService.refresh$.subscribe(() => {
      this.getZonas();
    });

  }


  getZonas() {
    this.zonaService.getZonas().subscribe((res: any) => {

      this.zonas = res;

    });
  }

  createZona() {
    this.router.navigateByUrl('catalogos/zonas/zona');
  }

  editZona(zona: Zona) {
    this.router.navigate(['catalogos/zonas/zona', zona.id]);
  }

  deleteZona(zona: Zona){
    
    Swal.fire({
      title: 'Eliminar',
      html: `¿Está ud. seguro de eliminar a <br><b>${zona.nombre}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f5ade',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.zonaService.deleteZona(zona).subscribe( (res:any) => {
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
      this.zonaService.getZonasByCriteria(this.filterForm.value.criterio, this.filterForm.value.palabra.toLocaleUpperCase()).subscribe((res) => {
        this.zonas = res;
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

