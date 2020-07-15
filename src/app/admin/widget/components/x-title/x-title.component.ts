import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-x-title',
    templateUrl: './x-title.component.html',
    styleUrls: ['./x-title.component.css']
})
export class XTitleComponent implements OnInit {

    @Input('title') _title: string;
    @Input('id') _id: string;

    constructor() { }

    ngOnInit(): void {
    }

}
