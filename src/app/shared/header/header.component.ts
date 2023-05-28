import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  logOut(){
    console.log('Bye Bye');
    sessionStorage.removeItem('nombreCompleto');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

}
