import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  usuario: Usuario;
  nombreUsuario: string;
  role: string;

  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuariosService
  ) {

    //this.menuItems = sidebarService.menu;

  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Usuario) => {

      //if(params.id)
      if (params.nombre) { //Preguntamos que params traiga datos, no puedo hacer la condicion unicamente con params por que como tal 'params' siempre existirá, vac<ío pero existe

        this.usuario = params;

        // if (!this.usuario.id) {
        //   this.nombreUsuario = localStorage.getItem('nombreCompleto');
        // }

        this.nombreUsuario = `${this.usuario.nombre} ${this.usuario.apellido_paterno}`;
        this.role = `${this.usuario.role}`;
      }else{
        this.nombreUsuario = localStorage.getItem('nombreCompleto');
        this.role = localStorage.getItem('role');
      }

    })

    this.menuItems = this.sidebarService.menu;

  }

  logOut(){
    console.log('Bye Bye');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

}
