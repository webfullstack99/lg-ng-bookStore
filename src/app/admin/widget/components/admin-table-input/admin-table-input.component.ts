import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-admin-table-input',
    templateUrl: './admin-table-input.component.html',
    styleUrls: ['./admin-table-input.component.css']
})
export class AdminTableInputComponent implements OnInit {

    @Input('inputData') _inputData: any = {}

    constructor() { }

    ngOnInit() {
    }

}
