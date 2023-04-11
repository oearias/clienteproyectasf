import { Component, OnInit } from '@angular/core';
import { SucursalesService } from '../../../services/sucursales.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Sucursal } from '../../../interfaces/Sucursal';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit {

  sucursalForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    clave: new FormControl(null, Validators.required)
  });

  editingSucursal: Sucursal;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sucursalService: SucursalesService,
    private toastr: ToastrService,
  ) {
    this.sucursalForm.setValue({
      id: null,
      nombre: null,
      clave: null
    });
   }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.sucursalService.getSucursal(params.id).subscribe(res => {

          this.editingSucursal = res;

          this.id?.setValue(this.editingSucursal.id);
          this.nombre?.setValue(this.editingSucursal.nombre);
          this.clave?.setValue(this.editingSucursal.clave);
        });

      }
    });
  }

  saveSucursal() {

    if (this.sucursalForm.valid) {

      if (this.sucursalForm.value.id != null) {

        this.sucursalService.updateSucursal(this.sucursalForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.sucursalService.insertSucursal(this.sucursalForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/sucursales');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/sucursales']);
  }

  setPath() {
    this.pathService.path = '/catalogos/sucursales';
  }

  //Getters
  get id() {
    return this.sucursalForm.get('id');
  }

  get nombre() {
    return this.sucursalForm.get('nombre');
  }

  get clave() {
    return this.sucursalForm.get('clave');
  }

}
