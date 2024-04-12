import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  logOut() {
    console.log('Bye Bye');

    //Aqui debemos de hacer la peticion al service
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
