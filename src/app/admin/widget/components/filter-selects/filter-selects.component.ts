import { Component, OnInit, Input } from '@angular/core';
import { UrlService } from 'src/app/shared/services/url.service';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: 'app-filter-selects',
    templateUrl: './filter-selects.component.html',
    styleUrls: ['./filter-selects.component.css']
})
export class FilterSelectsComponent implements OnInit {

    public _clientFilter: any = {};
    public _selected: any = {};

    @Input('controller') _controller: string;
    @Input('dbSelectData') _dbSelectData: any[];

    constructor(
        private _helperService: HelperService,
        private _urlService: UrlService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientFilter = clientFilter.filter;
            this.setSelected();
        })
    }

    public setSelected(): void {
        let selectFilters: any = this._helperService.getConf_selectFilter(this._controller);
        for (let selectFilter of selectFilters)
            this._selected[selectFilter.field] = this._clientFilter[selectFilter.field] || '';

    }

    public isSelected(field: string, value: string): boolean {
        return (this._selected[field] == value) ? true : false;
    }

    public onChange($event: any, field: string): void {
        let value = $event.target.value;
        this._router.navigateByUrl(this._urlService.getUrl({ queryParams: { [field]: value } }, { task: 'set-query-params' }));
    }
}
