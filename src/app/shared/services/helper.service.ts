import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor() { }

    public showTime(time): string{
        return `-- <span class="text-danger">${time}</span> --`;
    }
}
