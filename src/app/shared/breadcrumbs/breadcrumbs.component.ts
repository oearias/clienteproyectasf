import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { PathService } from '../../services/path.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent {

  public titulo: string;
  public raiz: boolean;

  constructor(
    private router: Router,
    private pathService: PathService
  ) {
    
    this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd)  => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd) => {

          if(event.snapshot.routeConfig.path != '' ){
            this.raiz = true;
          }else{
            this.raiz = false;
          }

          return event.snapshot.data
        } ),
      )
      .subscribe( ({titulo}) => {
        this.titulo = titulo
      })
  }

  volver(){
    this.router.navigate([this.pathService.path]);
  }

}
