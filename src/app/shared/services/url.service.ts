import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    public _urlSearchParams: URLSearchParams;

    constructor(
        private _helperService: HelperService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) { }

    public subscribeQueryParams(callback: (data: any) => void): void {
        this._activatedRoute.queryParams.subscribe((data: any) => {
            this._urlSearchParams = new URLSearchParams(window.location.search);
            if (this._helperService.isFn(callback)) callback(data);
        })
    }



    /**
     * Gets client filter: search and filter
     * @param controller 
     * @returns client filter 
     */
    public getClientFilter(controller: string, doneCallback: (clientFilter: any) => void): any {
        this.subscribeQueryParams((data) => {
            // btn filter
            let filters: string[] = [
                ...this._helperService.getTemplateConf(controller).filter,
            ];
            for (let item of this._helperService.getConf_selectFilter(controller)) {
                filters.push(item['field']);
            }

            let searchArr: string[] = this._helperService.getTemplateConf(controller).search;
            let sortArr: string[] = this._helperService.getTemplateConf(controller).sort;
            let clientFilter: any = { filter: {}, sort: {}, search: {}, other: {} };


            // filter property
            for (let filter of filters) {
                clientFilter.filter[filter] = data[filter] || 'all';
            }

            // filter search
            for (let search of searchArr) {
                if (data.search_field == search) {
                    clientFilter.search = this.getSearchObj(data.search_field, data.search_value)
                    break;
                }
            }
            if (Object.keys(clientFilter.search).length < 1) {
                clientFilter.search = this.getSearchObj(data.search_field || 'all', data.search_value)
            }

            // sort
            for (let sort of sortArr) {
                if (data.sort_field == sort) {
                    clientFilter.sort = this.getSortObj(data.sort_field, data.sort_order)
                    break;
                }
            }

            // other
            clientFilter.other.page = data.page;

            // done callback
            if (this._helperService.isFn(doneCallback)) doneCallback(clientFilter);
        })
    }

    private getSortObj(field: string, order: string = ''): object {
        return {
            sort_field: field.trim(),
            sort_order: order.trim(),
        }
    }

    private getSearchObj(searchField: string, searchValue: string = ''): object {
        return {
            search_field: searchField,
            search_value: searchValue,
        }
    }


    /**
     * Gets url
     * @param params - {queryParams}
     * @param options - {task}
     * @returns url 
     */
    public getUrl(params: any, options: any): string {
        let url: string = window.location.pathname;
        this._urlSearchParams = new URLSearchParams(window.location.search);
        switch (options.task) {
            case 'set-query-params':
                for (let key in params.queryParams) {
                    this._urlSearchParams.set(key, params.queryParams[key]);
                }
                break;
        }

        url = (this._urlSearchParams.toString() != '') ? `${url}?${this._urlSearchParams.toString()}` : url;
        return url;
    }

    public getQueryParam(name: string) {
        return this._urlSearchParams.get(name);
    }

    public getQueryParamObj(): object {
        let result: object = {};
        if (this._urlSearchParams)
            for (let entry of this._urlSearchParams['entries']())
                result[entry[0]] = entry[1];
        return result;
    }
}
