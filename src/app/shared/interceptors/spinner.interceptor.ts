import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor{

    pendingRequests = 0;


    constructor(
        private spinnerService: SpinnerService
    ){
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        
        this.spinnerService.show();
        this.pendingRequests++;

        return next.handle(req).pipe(
            finalize( () => {
                //this.spinnerService.hide();
                this.pendingRequests--;

                if (this.pendingRequests === 0) {
                    this.spinnerService.hide();
                }
                
            } )
        )
    }

}
