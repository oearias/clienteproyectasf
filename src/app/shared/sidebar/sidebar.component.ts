import { Component, OnDestroy, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  private navigationSubscription: Subscription;

  menuItems: any[];
  usuario: Usuario;
  nombreUsuario: string;
  role: string;

  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuariosService,
  ) {

    //this.menuItems = sidebarService.menu;

  }
  ngOnDestroy(): void {
    //este fragmento de código permite la recarga de los archivos js si se trae el parametro reload
    this.navigationSubscription = this.router.events.subscribe( (event)=>{
      if(event instanceof NavigationEnd){
        if(event.url.includes('?reload=true')){
          location.reload();
        }
      }
    });
    
  }

  ngOnInit(): void {

    // this.route.queryParams.subscribe(params => {
    //   if (params['reload']) {
    //     location.reload();
    //   }
    // });

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
        this.nombreUsuario = sessionStorage.getItem('nombreCompleto');
        this.role = sessionStorage.getItem('role');
      }

    })

    this.menuItems = this.sidebarService.menu;

  }

  logOut(){
    console.log('Bye Bye');
    sessionStorage.removeItem('nombreCompleto');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

}
