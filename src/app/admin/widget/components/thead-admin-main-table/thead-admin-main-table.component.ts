import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UrlService } from 'src/app/shared/services/url.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: '[app-thead-admin-main-table]',
    templateUrl: './thead-admin-main-table.component.html',
    styleUrls: ['./thead-admin-main-table.component.css']
})
export class TheadAdminMainTableComponent implements OnInit, AfterViewInit {
    public _sortArr: string[];
    public _clientSort: any;

    @Input('thead-data') _data: any[];
    @Input('controller') _controller: string;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public _urlService: UrlService,
        public _helperService: HelperService,
    ) { }
    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this._sortArr = this._helperService.getConf_sortArr(this._controller);
        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientSort = clientFilter.sort;
        })

        for (let head of this._data)
            head.hasSort = (this._sortArr.includes(head.field));
    }

    public onSortClick($event: any, field: string) {
        this._clientSort = {
            sort_field: field,
            sort_order: this.getNewOrder(field),
        }

        this._router.navigateByUrl(this._urlService.getUrl({ queryParams: this._clientSort }, { task: 'set-query-params' }));
        $event.preventDefault();
    }

    private getNewOrder(field: string): string {
        return (this._clientSort.sort_field == field && this._clientSort.sort_order == 'asc') ? 'desc' : 'asc';
    }

public getSortIcon(): any {
        let order = (this._clientSort.sort_order == 'asc') ? 'up' : 'down';
        return `<i class="fas fa-sort-${order}"></i>`;
    }
}
