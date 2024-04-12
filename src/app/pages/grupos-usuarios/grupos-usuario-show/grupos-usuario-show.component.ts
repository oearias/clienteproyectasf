import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GrupoUsuario } from 'src/app/interfaces/GrupoUsuario';
import { Modulo } from 'src/app/interfaces/Modulo';
import { PermisoModulo } from 'src/app/interfaces/PermisoModulo';
import { PermisoSubmodulo } from 'src/app/interfaces/PermisoSubmodulo';
import { Submodulo } from 'src/app/interfaces/Submodulo';
import { GrupoUsuarioService } from 'src/app/services/grupo-usuario.service';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-grupos-usuario-show',
  templateUrl: './grupos-usuario-show.component.html',
  styleUrls: ['./grupos-usuario-show.component.css']
})
export class GruposUsuarioShowComponent implements OnInit {

  grupoUsuario: GrupoUsuario;
  modulos: Modulo[];
  submodulos: Submodulo[];
  permisos_modulos: PermisoModulo[];
  permisos_submodulos: PermisoSubmodulo[];

  permisosModulosSeleccionados: number[] = [];
  permisosModulosNoSeleccionados: number[] = [];
  permisosSubmodulosSeleccionados: number[] = [];
  permisosSubmodulosNoSeleccionados: number[] = [];

  relacionesModuloSubmodulo: { [key: number]: number[] } = {};

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private grupoUsuarioService: GrupoUsuarioService,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.grupoUsuarioService.getGrupoUsuario(params.id).subscribe(res => {

          this.grupoUsuario = res;

          this.setPath()

        });

        this.grupoUsuarioService.getPermisosModulosByUserGroupID(params.id).subscribe(res => {

          this.permisos_modulos = res.permisos_modulos;
          this.permisos_submodulos = res.permisos_submodulos;
          this.modulos = res.modulos;
          this.submodulos = res.submodulos;

          //Agregamos a los arreglos los valores iniciales

          this.modulos.forEach(modulo =>{

            this.permisos_modulos.forEach(permisos =>{

              if(modulo.id === permisos.modulo.id){

                this.permisosModulosSeleccionados.push(permisos.modulo.id);

              }else{

                this.permisosModulosNoSeleccionados.push(modulo.id);

              }

  
            });


          })

          this.submodulos.forEach(submodulo =>{

            this.permisos_submodulos.forEach(permisos =>{

              if(submodulo.id === permisos.submodulo.id ){

                this.permisosSubmodulosSeleccionados.push(permisos.submodulo.id);

              }else{
           
                this.permisosSubmodulosNoSeleccionados.push(submodulo.id);
              }

  
            });


          })

        });

      }
    });

  }
  

  submoduloSeleccionado(submoduloId: number): boolean {
    return this.permisos_submodulos.some(item => item.submodulo.id === submoduloId);
  }

  moduloSeleccionado(moduloId: number): boolean {
    
    return this.permisos_modulos.some(item => item.modulo.id === moduloId);

  }



  onModuloChange(moduloId: number, event: Event) {
    
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {

      console.log(`Módulo ${moduloId} seleccionado`);
      this.permisosModulosSeleccionados.push(moduloId);
      this.removeElementFromArray(this.permisosModulosNoSeleccionados, moduloId);
      

    } else {

      console.log(`Módulo ${moduloId} deseleccionado`);
      this.removeElementFromArray(this.permisosModulosSeleccionados, moduloId);
      this.permisosModulosNoSeleccionados.push(moduloId);
    }
  }
  
  onSubmoduloChange(submoduloId: number, moduloId: number, event: Event) {
    
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {

      // El submódulo se ha seleccionado
      console.log(`Submódulo ${submoduloId} del módulo ${moduloId} seleccionado`);
      this.permisosSubmodulosSeleccionados.push(submoduloId);
      this.removeElementFromArray(this.permisosSubmodulosNoSeleccionados, submoduloId);

    } else {

      // El submódulo se ha deseleccionado
      console.log(`Submódulo ${submoduloId} del módulo ${moduloId} deseleccionado`);
      this.removeElementFromArray(this.permisosSubmodulosSeleccionados, submoduloId);
      this.permisosSubmodulosNoSeleccionados.push(submoduloId);

    }
  }
  
  removeElementFromArray(array: number[], element: number) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  

  saveGrupoUsuario() {

    const data = {
      user_group_id: this.grupoUsuario.id,
      permisosModulosSeleccionados: this.permisosModulosSeleccionados,
      permisosSubmodulosSeleccionados: this.permisosSubmodulosSeleccionados,
    }

    this.grupoUsuarioService.updatePermisosModulosSubmodulos(data).subscribe((res:any) => {

      this.toastr.success(res);

    },(err) => {

      this.toastr.error(err.error);

    })

    this.router.navigateByUrl('/settings/gruposUsuarios');

  }

  volver() {
    this.router.navigate(['/settings/gruposUsuarios']);
  }

  setPath() {
    this.pathService.path = '/settings/gruposUsuarios/'
  }


}
