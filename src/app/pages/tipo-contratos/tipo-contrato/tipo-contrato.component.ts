import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoContrato } from 'src/app/interfaces/TipoContrato';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-tipo-contrato',
  templateUrl: './tipo-contrato.component.html',
  styleUrls: ['./tipo-contrato.component.css']
})
export class TipoContratoComponent implements OnInit {

  tipoContratoForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
  });

  editingTipoContrato: TipoContrato;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private tipoContratoService: TipoContratoService
  ) { 
    this.tipoContratoForm.setValue({
      id: null,
      nombre: null,
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.tipoContratoService.getTipoContrato(params.id).subscribe(res => {

          this.editingTipoContrato = res;

          this.id?.setValue(this.editingTipoContrato.id);
          this.nombre?.setValue(this.editingTipoContrato.nombre);
        });

      }
    });
  }

  saveTipoContrato() {

    if (this.tipoContratoForm.valid) {

      if (this.tipoContratoForm.value.id != null) {

        this.tipoContratoService.updateTipoContrato(this.tipoContratoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.tipoContratoService.insertTipoContrato(this.tipoContratoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/tipoContratos');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/tipoContratos']);
  }

  setPath() {
    this.pathService.path = '/catalogos/tipoContratos';
  }

  //Getters
  get id() {
    return this.tipoContratoForm.get('id');
  }

  get nombre() {
    return this.tipoContratoForm.get('nombre');
  }

}
