import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ucfirst'
})
export class UcfirstPipe implements PipeTransform {

    transform(str: string, ): string {
        if (str.length > 0) return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
        return str
    }

}
