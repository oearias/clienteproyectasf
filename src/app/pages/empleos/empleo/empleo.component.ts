import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoEmpleo } from '../../../interfaces/TipoEmpleo';
import { TipoEmpleoService } from '../../../services/tipo-empleo.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.css']
})
export class EmpleoComponent implements OnInit {

  tipoEmpleoForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required)
  });

  editingTipoEmpleo: TipoEmpleo;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tipoEmpleoService: TipoEmpleoService,
    private toastr: ToastrService,
  ) {
    this.tipoEmpleoForm.setValue({
      id: null,
      nombre: null
    });
   }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.tipoEmpleoService.getTipoEmpleo(params.id).subscribe(res => {

          this.editingTipoEmpleo = res;
          this.id?.setValue(this.editingTipoEmpleo.id);
          this.nombre?.setValue(this.editingTipoEmpleo.nombre);
          
        });

      }
    });
  }

  saveTipoEmpleo() {

    if (this.tipoEmpleoForm.valid) {

      if (this.tipoEmpleoForm.value.id != null) {

        this.tipoEmpleoService.updateTipoEmpleo(this.tipoEmpleoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.tipoEmpleoService.insertTipoEmpleo(this.tipoEmpleoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/empleos');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/empleos']);
  }

  setPath(){
    this.pathService.path = '/catalogos/empleos';
  }

  //Getters
  get id() {
    return this.tipoEmpleoForm.get('id');
  }

  get nombre() {
    return this.tipoEmpleoForm.get('nombre');
  }


}
