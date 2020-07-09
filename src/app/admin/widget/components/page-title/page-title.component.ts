import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {

    @Input('controller') _controller: string = 'title';

    constructor() { }

    ngOnInit(): void {
    }

    public getTitle(): string {
        return `${this._controller} page`;
    }


}
