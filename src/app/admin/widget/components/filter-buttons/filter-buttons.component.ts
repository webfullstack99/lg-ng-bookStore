import { Component, OnInit, Input } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
    selector: 'app-filter-buttons',
    templateUrl: './filter-buttons.component.html',
    styleUrls: ['./filter-buttons.component.css']
})
export class FilterButtonsComponent implements OnInit {
    public _filters: string[];
    public _selectData: string[];
    public _clientFilter: any = {};
    @Input('controller') _controller: string

    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _urlService: UrlService,
    ) { }

    ngOnInit(): void {
        this._filters = this._helperService.getTemplateConf(this._controller).filter;
        this._selectData = this._helperService.getConf_selectData();

        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientFilter = clientFilter.filter;
        })
    }

    public getBtnData(filter: string, btnType: string): any {
        let template = this._helperService.getConf_btnTemplate()[filter][btnType];
        this._helperService.getConf_btnTemplate()[filter]['all'];
        let btnData = {
            classes: (btnType == this._clientFilter[filter]) ? 'btn btn-info' : 'btn btn-secondary',
            content: template.content,
        };
        return btnData;
    }

    public getFilterOptions(filter: string) {
        let result = [...this._helperService.getConf_selectData()[filter]];
        result.unshift('all');
        return result;
    }

    public getQueryParams(filter: string, btnType: string): any {
        return { [filter]: btnType }
    }
}
