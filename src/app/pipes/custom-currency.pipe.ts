import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

    transform(value: number | null): string | null {

        if (value === null || isNaN(value)) {
            return null; // Devuelve null si el valor no es válido
        }

        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = value.toFixed(2).split('.');
        arr[0] = arr[0].replace(exp, rep);
        return arr[1] ? arr.join('.') : arr[0];
    }
}
