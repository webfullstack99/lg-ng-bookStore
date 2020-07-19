import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/admin/shared/services/http.service';

@Component({
    selector: 'app-raw-data',
    templateUrl: './raw-data.component.html',
    styleUrls: ['./raw-data.component.css']
})
export class RawDataComponent implements OnInit {

    constructor(
        private _httpService: HttpService,
    ) { }

    ngOnInit() {

        this._httpService.raw();
    }

}
