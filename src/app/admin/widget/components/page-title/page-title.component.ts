import { Component, OnInit, Input } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {

    @Input('controller') _controller: string = 'title';

    constructor(
        public _conf: Conf
    ) { }

    ngOnInit(): void {
    }

    public getTitle(): string {
        return `${this._controller} page`;
    }


}
