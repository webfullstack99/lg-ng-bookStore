import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const $: any;

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(
        private _http: HttpClient,
    ) { }

    public raw(): void {
        $.get("http://localhost:4200?url=www.google.com", function (response) { alert(response) });
    }

}
