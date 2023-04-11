import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  labelNombre='';
  labelEmail='';
  labelRole='';

  usuarioForm = this.fb.group({
    id: new FormControl(null),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    password2: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl(null),
  });

  editingUsuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuariosService,
    private toastr: ToastrService,
  ) { 
    this.usuarioForm.setValue({
      id: null,
      password: null,
      password2: null,
      nombre:null
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      if (params.id) {

        this.usuarioService.getUsuario(params.id).subscribe(usuario => {

          this.labelNombre = usuario?.nombre_completo;

          this.editingUsuario = usuario;

          this.id?.setValue(this.editingUsuario.id);
          this.nombre?.setValue(`${this.editingUsuario.nombre} ${this.editingUsuario?.apellido_paterno}`);

          this.nombre.disable();
        });

      }
    });
  }

  resetPassword() {

    if (this.usuarioForm.valid) {

      if(this.password.value == this.password2.value ){

        if (this.usuarioForm.value.id != null) {

          this.usuarioService.changePassword(this.usuarioForm.value).subscribe((res: any) => {
  
            this.toastr.success(res);
  
          });
        } 
  
        this.router.navigateByUrl('/settings/usuarios/usuario2');

      }else{
        this.toastr.error('Las contraseñas no coinciden');
      }

    }
  }

  volver() {
    if(this.editingUsuario.id){

      this.router.navigate(['/settings/usuarios/usuario2', this.editingUsuario.id]);
    }else{
      this.router.navigate(['/settings/usuarios/usuario2']);
    }

  }

  // setPath() {

  //   if(this.editingUsuario.id){
  //     this.pathService.path = '/catalogos/tipoContratos';
  //   }

  //   this.pathService.path = '/catalogos/tipoContratos';
  // }

  //Getters
  get id() {
    return this.usuarioForm.get('id');
  }

  get password() {
    return this.usuarioForm.get('password');
  }

  get password2() {
    return this.usuarioForm.get('password2');
  }

  get nombre() {
    return this.usuarioForm.get('nombre');
  }


}
