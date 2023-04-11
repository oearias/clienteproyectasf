import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgenciasService } from 'src/app/services/agencias.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { Agencia } from '../../../interfaces/Agencia';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-agencia',
  templateUrl: './agencia.component.html',
  styleUrls: ['./agencia.component.css']
})
export class AgenciaComponent implements OnInit {

  zonas: any = [];

  agenciaForm = this.fb.group({
    id: new FormControl(null),
    zona_id: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
  });

  editingAgencia: Agencia;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private agenciaService: AgenciasService,
    private zonaService: ZonasService
  ) { 
    this.agenciaForm.setValue({
      id: null,
      zona_id: 1,
      nombre: null,
    });
  }

  ngOnInit(): void {

    this.setPath();
    this.getZonas();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.agenciaService.getAgencia(params.id).subscribe(res => {

          this.editingAgencia = res;

          this.id?.setValue(this.editingAgencia.id);
          this.nombre?.setValue(this.editingAgencia.nombre);
          this.zona_id.setValue(this.editingAgencia.zona_id);
        });

      }
    });
  }

  getZonas() {
    this.zonaService.getZonas().subscribe(res => {
      this.zonas = res;
    })
  }

  saveAgencia() {

    if (this.agenciaForm.valid) {

      if (this.agenciaForm.value.id != null) {

        this.agenciaService.updateAgencia(this.agenciaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.agenciaService.insertAgencia(this.agenciaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/agencias');

    }
  }
  
  volver() {
    this.router.navigate(['/catalogos/agencias']);
  }

  setPath(){
    this.pathService.path = '/catalogos/agencias';
  }

  //Getters
  get id() {
    return this.agenciaForm.get('id');
  }

  get zona_id() {
    return this.agenciaForm.get('zona_id');
  }

  get nombre() {
    return this.agenciaForm.get('nombre');
  }

}
