import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

    @Input('controller') _controller: string
    constructor() { }

    ngOnInit(): void {
    }

}
