import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
    providedIn: 'root'
})
export class HighlightService {

    constructor(
        private _helperService: HelperService,
    ) { }

    public highlightSearchDataForAdminMainTable(clientFilter: any, items: any[], controller: string): any[] {
        let clientSearch = clientFilter.search;
        let searchArr = this._helperService.getConf_searchArr(controller);
        let searchValuePattern = new RegExp(`${clientSearch.search_value}`, 'i');
        if (clientSearch.search_value.trim() != '') {
            // client search

            if (clientSearch.search_field == 'all') {
                // search all
                for (let item of items)
                    for (let search of searchArr)
                        if (this._helperService.getVal(item, `${search}.value`).match(searchValuePattern))
                            item[search].value = this.highlight(item[search].value, clientSearch.search_value);

            } else
                // search property
                for (let item of items)
                    item[clientSearch.search_field].value = this.highlight(item[clientSearch.search_field].value, clientSearch.search_value);

        }
        return items;
    }

    private highlight(content: string, searchKey: string): string {
        let pattern = new RegExp(`(${searchKey})`, 'ig');
        content = content.replace(pattern, '<span class="bg-highlight">$1</span>');
        return content;
    }
}
