import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GrupoUsuario } from 'src/app/interfaces/GrupoUsuario';
import { GrupoUsuarioService } from 'src/app/services/grupo-usuario.service';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-grupos-usuario',
  templateUrl: './grupos-usuario.component.html',
  styleUrls: ['./grupos-usuario.component.css']
})
export class GruposUsuarioComponent implements OnInit {

  grupoUsuarioForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required)
  });

  editingGrupoUsuario: GrupoUsuario;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private grupoUsuarioService: GrupoUsuarioService,
  ) { 
    this.grupoUsuarioForm.setValue({
      id: null,
      nombre: null,
      descripcion: null,
    });
  }

  ngOnInit(): void {

    this.setPath()

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.grupoUsuarioService.getGrupoUsuario(params.id).subscribe(res => {

          console.log(res);

          this.editingGrupoUsuario = res;

          this.id?.setValue(this.editingGrupoUsuario.id);
          this.nombre?.setValue(this.editingGrupoUsuario.nombre);
          this.descripcion?.setValue(this.editingGrupoUsuario.descripcion);
        });

      }
    });
  }

  saveGrupoUsuario() {

    if (this.grupoUsuarioForm.valid) {

      if (this.grupoUsuarioForm.value.id != null) {

        this.grupoUsuarioService.updateGrupoUsuario(this.grupoUsuarioForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.grupoUsuarioService.insertGrupoUsuario(this.grupoUsuarioForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/settings/gruposUsuarios');

    }
  }

  volver() {
    this.router.navigate(['/settings/gruposUsuarios']);
  }

  setPath(){
    this.pathService.path = '/settings/gruposUsuarios';
  }

  //Getters
  get id() {
    return this.grupoUsuarioForm.get('id');
  }

  get nombre() {
    return this.grupoUsuarioForm.get('nombre');
  }

  get descripcion() {
    return this.grupoUsuarioForm.get('descripcion');
  }

}
