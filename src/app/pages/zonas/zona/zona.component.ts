import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Zona } from 'src/app/interfaces/Zona';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit {

  sucursales: any = [];

  zonaForm = this.fb.group({
    id: new FormControl(null),
    sucursal_id: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
  });

  editingZona: Zona;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private zonaService: ZonasService,
    private sucursalService: SucursalesService
  ) {
    this.zonaForm.setValue({
      id: null,
      sucursal_id: 1,
      nombre: null,
    });
   }

  ngOnInit(): void {

    this.setPath();
    
    this.getSucursales();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.zonaService.getZona(params.id).subscribe(res => {

          this.editingZona = res;

          this.id?.setValue(this.editingZona.id);
          this.nombre?.setValue(this.editingZona.nombre);
          this.sucursal_id.setValue(this.editingZona.sucursal_id);
        });

      }
    });

  }

  getSucursales() {
    this.sucursalService.getSucursales().subscribe(res => {
      this.sucursales = res;
    })
  }

  saveZona() {

    if (this.zonaForm.valid) {

      if (this.zonaForm.value.id != null) {

        this.zonaService.updateZona(this.zonaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.zonaService.insertZona(this.zonaForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/zonas');

    }
  }
  
  volver() {
    this.router.navigate(['/catalogos/zonas']);
  }

  setPath() {
    this.pathService.path = '/catalogos/zonas';
  }

  //Getters
  get id() {
    return this.zonaForm.get('id');
  }

  get sucursal_id() {
    return this.zonaForm.get('sucursal_id');
  }

  get nombre() {
    return this.zonaForm.get('nombre');
  }

}
