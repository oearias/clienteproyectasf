import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Financiamiento } from 'src/app/interfaces/Financiamiento';
import { FinanciamientosService } from 'src/app/services/financiamientos.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-financiamiento',
  templateUrl: './financiamiento.component.html',
  styleUrls: ['./financiamiento.component.css']
})
export class FinanciamientoComponent implements OnInit {

  financiamientoForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
  });

  editingFinanciamiento: Financiamiento;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private financiamientoService: FinanciamientosService,
    private toastr: ToastrService,
  ) {
    this.financiamientoForm.setValue({
      id: null,
      nombre: null,
    });
   }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.financiamientoService.getFinanciamiento(params.id).subscribe(res => {

          this.editingFinanciamiento = res;

          this.id?.setValue(this.editingFinanciamiento.id);
          this.nombre?.setValue(this.editingFinanciamiento.nombre);
        });

      }
    });
  }

  saveFinanciamiento() {

    if (this.financiamientoForm.valid) {

      if (this.financiamientoForm.value.id != null) {

        this.financiamientoService.updateFinanciamiento(this.financiamientoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.financiamientoService.insertFinanciamiento(this.financiamientoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/financiamientos');

    }
  }

  onChangeFinanciamiento(event) {
    console.log(event);
  }

  volver() {
    this.router.navigate(['/catalogos/financiamientos']);
  }

  setPath(){
    this.pathService.path = '/catalogos/financiamientos';
  }

  //Getters
  get id() {
    return this.financiamientoForm.get('id');
  }

  get nombre() {
    return this.financiamientoForm.get('nombre');
  }


}
