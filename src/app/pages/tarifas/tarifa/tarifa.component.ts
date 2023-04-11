import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tarifa } from 'src/app/interfaces/Tarifa';
import { TarifasService } from 'src/app/services/tarifas.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.css']
})
export class TarifaComponent implements OnInit {

  tarifaForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    cociente: new FormControl(null, Validators.required),
    num_semanas: new FormControl(null, Validators.required),
  });

  editingTarifa: Tarifa;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tarifaService: TarifasService,
    private toastr: ToastrService,
  ) { 
    this.tarifaForm.setValue({
      id: null,
      nombre: null,
      cociente: null,
      num_semanas: null,
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.tarifaService.getTarifa(params.id).subscribe(res => {

          this.editingTarifa = res;

          this.id?.setValue(this.editingTarifa.id);
          this.nombre?.setValue(this.editingTarifa.nombre);
          this.cociente?.setValue(this.editingTarifa.cociente * 100);
          this.num_semanas?.setValue(this.editingTarifa.num_semanas);
        });

      }
    });
  }

  saveTarifa() {

    if (this.tarifaForm.valid) {

      if (this.tarifaForm.value.id != null) {

        this.tarifaService.updateTarifa(this.tarifaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.tarifaService.insertTarifa(this.tarifaForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/tarifas');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/tarifas']);
  }

  setPath() {
    this.pathService.path = '/catalogos/tarifas';
  }

  //Getters
  get id() {
    return this.tarifaForm.get('id');
  }

  get nombre() {
    return this.tarifaForm.get('nombre');
  }

  get cociente() {
    return this.tarifaForm.get('cociente');
  }

  get num_semanas() {
    return this.tarifaForm.get('num_semanas');
  }

}
