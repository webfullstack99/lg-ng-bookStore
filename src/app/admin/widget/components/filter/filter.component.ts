import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

    @Input('controller') _controller: string;
    @Input('filterCount') _filterCount: any = {};
    @Input('dbSelectData') _dbSelectData: any[];

    constructor() { }

    ngOnInit(): void { }

}
