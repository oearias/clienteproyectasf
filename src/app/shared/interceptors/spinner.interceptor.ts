import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

    pendingRequests = 0;

    constructor(
        private spinnerService: SpinnerService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let hasSearchTermParam = false; // Declarar aquí

        if (req.url) {
            try {
                const url = new URL(req.url);
                const searchParams = url.searchParams;

                // Obtén los parámetros de consulta de la URL

                console.log(searchParams);

                // Verifica si el parámetro "searchTerm" existe y si su valor es nulo o una cadena vacía
                const searchTerm = searchParams.get('searchTerm');
                hasSearchTermParam = searchTerm === null || searchTerm === '';

                // Si "searchTerm" no existe o es nulo o una cadena vacía, muestra el loading spinner
                if (hasSearchTermParam) {
                    this.spinnerService.show();
                    this.pendingRequests++;
                }
            } catch (error) {
                console.error('URL inválida:', req.url);
            }
        }

        return next.handle(req).pipe(
            finalize(() => {
                // Resto del código...
                if (hasSearchTermParam) {
                    this.pendingRequests--;
                }

                if (this.pendingRequests === 0 && hasSearchTermParam) {
                    this.spinnerService.hide();
                }
            })
        );
    }
}
