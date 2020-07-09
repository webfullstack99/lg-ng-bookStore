import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-main-table',
    templateUrl: './main-table.component.html',
    styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit {
    @Input('items') _items: object[];

    constructor() { }

    ngOnInit(): void {
    }

}
