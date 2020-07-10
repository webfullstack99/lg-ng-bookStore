import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UrlService {

    constructor(
        private _helperService: HelperService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) { }


    /**
     * Gets client filter: search and filter
     * @param controller 
     * @returns client filter 
     */
    public getClientFilter(controller: string, doneCallback: (clientFilter: any) => void): any {
        // btn filter
        this._activatedRoute.queryParams.subscribe((data) => {
            let filters: string[] = this._helperService.getTemplateConf(controller).filter;
            let clientFilter: any = {filter: {}, sort: {}, search: {}};
            for (let filter of filters) {
                clientFilter.filter[filter] = data[filter] || 'all';
            }
            if (this._helperService.isFn(doneCallback)) doneCallback(clientFilter);
        })
    }
}
