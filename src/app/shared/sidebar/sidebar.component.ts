import { Component, OnDestroy, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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

  modulos: any[];

  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuariosService,
    private authService: AuthService
  ) {

    //this.menuItems = sidebarService.menu;

  }
  ngOnDestroy(): void {
    //este fragmento de código permite la recarga de los archivos js si se trae el parametro reload
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('?reload=true')) {
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

      } else {

        this.nombreUsuario = sessionStorage.getItem('nombreCompleto');
      }
      
    })
    
    //Aqui es donde podemos obtener los modulos a los cuales tiene acceso
    //esto lo podemos hacer simplemente leyendo el storage item
    
    const arreglo = localStorage.getItem('modulos');
    this.role = localStorage.getItem('role');



    if (arreglo) {
      this.modulos = JSON.parse(arreglo);
    }
    //this.menuItems = this.sidebarService.menu;

    this.menuItems = this.modulos;

  }

  logOut() {
    console.log('Bye Bye');

    this.authService.logout().subscribe((res: any) => {

      if (res && res.message == 'Sesión finalizada correctamente') {

        // Limpiar datos de sesión después de cerrar sesión
        sessionStorage.removeItem('nombreCompleto');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        // Redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
      }

    });
  }

}
