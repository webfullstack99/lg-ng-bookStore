import { Component, OnInit, Input } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    public _searchArr: string[];
    public _searchTemplate: any;
    public _clientSearch: any;
    private _searchTimeout: any;
    private _timeout: number = this._conf.params.defaultTimeout;

    @Input('controller') _controller: string

    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public _urlService: UrlService,
    ) { }

    ngOnInit(): void {
        this._searchArr = this._helperService.getConf_searchArr(this._controller);
        this._searchTemplate = this._helperService.getConf_searchTemplate();
        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientSearch = clientFilter.search;
        })
    }

    // get
    public getSearchingField(): string {
        return this._clientSearch.search_field;
    }

    public getSearchFieldText(search: string): string {
        return this._searchTemplate[search]
    }

    // action
    public onChangeSearchField($event, searchField: string): void {
        this._clientSearch.search_field = searchField;
        this.search();
    }

    public onSearch($event: any): void {
        this._clientSearch.search_value = $event.target.value.trim();
        clearTimeout(this._searchTimeout);
        this._searchTimeout = setTimeout(() => {
            this.search();
        }, this._timeout);
    }

    public onSubmit($event): void {
        this.search();
        $event.preventDefault();
    }

    public search(): void {
        this._router.navigateByUrl(this._urlService.getUrl({ queryParams: this._clientSearch }, { task: 'set-query-params' }));
    }
}
