import { Component, OnInit } from '@angular/core';
import { TipoAsentamientoService } from '../../../services/tipo-asentamiento.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Colonia } from 'src/app/interfaces/Colonia';
import { Router, ActivatedRoute } from '@angular/router';
import { ColoniasService } from '../../../services/colonias.service';
import { ToastrService } from 'ngx-toastr';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-colonia',
  templateUrl: './colonia.component.html',
  styleUrls: ['./colonia.component.css']
})
export class ColoniaComponent implements OnInit {

  tipoAsentamientos: any = [];

  coloniaForm = this.fb.group({
    id: new FormControl(null),
    tipo_asentamiento_id: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
    cp: new FormControl(null, Validators.required)
  });

  editingColonia: Colonia;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private coloniaService: ColoniasService,
    private tipoAsentamientoService: TipoAsentamientoService
  ) {
    this.coloniaForm.setValue({
      id: null,
      tipo_asentamiento_id: 1,
      nombre: null,
      cp: null
    });
  }

  ngOnInit(): void {

    this.setPath()

    this.getTipoAsentamientos();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.coloniaService.getColonia(params.id).subscribe(res => {

          this.editingColonia = res;

          this.id?.setValue(this.editingColonia.id);
          this.nombre?.setValue(this.editingColonia.nombre);
          this.cp?.setValue(this.editingColonia.cp);
          this.tipo_asentamiento_id.setValue(this.editingColonia.tipo_asentamiento_id);
        });

      }
    });
  }

  getTipoAsentamientos() {
    this.tipoAsentamientoService.getTipoAsentamientos().subscribe(res => {
      this.tipoAsentamientos = res;
    })
  }

  saveColonia() {

    if (this.coloniaForm.valid) {

      if (this.coloniaForm.value.id != null) {

        this.coloniaService.updateColonia(this.coloniaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.coloniaService.insertColonia(this.coloniaForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/colonias');

    }
  }

  onChangeTipoAsentamiento(event) {
    console.log(event);
  }

  volver() {
    this.router.navigate(['/catalogos/colonias']);
  }

  setPath(){
    this.pathService.path = '/catalogos/colonias';
  }

  //Getters
  get id() {
    return this.coloniaForm.get('id');
  }

  get tipo_asentamiento_id() {
    return this.coloniaForm.get('tipo_asentamiento_id');
  }

  get nombre() {
    return this.coloniaForm.get('nombre');
  }

  get cp() {
    return this.coloniaForm.get('cp');
  }

}
