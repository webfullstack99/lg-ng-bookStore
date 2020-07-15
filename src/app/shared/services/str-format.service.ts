import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StrFormatService {

    constructor() { }

    public format(string: string, ...args): string {
        let i = 0;
        for (let arg of args) {
            string = string.replace(`{${i}}`, arg);
            i++;
        }
        string = string.replace(/ \{\d+\}/g, '');
        return string;
    }
}
