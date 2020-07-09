import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: '[app-table-emtpy-message]',
    templateUrl: './table-emtpy-message.component.html',
    styleUrls: ['./table-emtpy-message.component.css']
})
export class TableEmtpyMessageComponent implements OnInit {
    @Input('colspan') _colspan: number = 1000;

    constructor() { }

    ngOnInit(): void {
    }

}
