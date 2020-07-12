import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';
import { PageService } from '../../services/page.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { IItem } from 'src/app/shared/defines/item.interface';
import { Router } from '@angular/router';
import { Conf } from 'src/app/shared/defines/conf';
import { createCssSelector } from '@angular/compiler/src/render3/view/template';
import { UrlService } from 'src/app/shared/services/url.service';
import { HighlightService } from 'src/app/shared/services/highlight.service';

declare let $: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    public _controller: string;
    public _items: IItem[];
    public _clientFilter: any = {};
    public _hasData: boolean;
    public _selectedItems: any[];

    constructor(
        public _helperService: HelperService,
        public _highlightService: HighlightService,
        private _pageService: PageService,
        private _modelService: _ModelService,
        private _urlService: UrlService,
        private _router: Router,
        private _conf: Conf,

    ) { }

    ngOnInit(): void {
        // assign controller
        this._controller = this._pageService._controller;
        this._modelService.controller = this._controller;

        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientFilter = clientFilter;
            this.listData();
        })
    }

    private listData(): void {
        this._modelService.listItems({
            clientFilter: this._clientFilter,
        }, {
            task: 'list-for-main-table',
            freshDataCallback: (data: IItem[]) => {
                if (data) if (data.length > 0) this._hasData = true;

            },
            doneCallback: (data: IItem[]) => {
                this._items = this._highlightService.highlightSearchDataForAdminMainTable(this._clientFilter, data, this._controller);
            }
        });
    }

    // Edit item
    public onEditClick(item: IItem): void {
        this._router.navigate([this._conf.prefix.admin, this._controller, 'form', item.$key]);
    }

    // Delete item
    public onDeleteClick(item: IItem): void {
        $(`tr[data-key="${item.$key}"]`).addClass('bg-delete-warning');
        this._modelService.saveItem({ item }, { task: 'delete-one' });
    }

    // View item
    public onViewClick(item: IItem): void {
    }


    /**
     * Determines whether action click on
     * @param data {action, item}
     */
    public onActionClick(data: any): void {
        this[`on${this._helperService.ucfirst(data.action)}Click`](data.item);
    }

    // Change status
    public onStatusClick(item: IItem): void {
        let tempItem = { ...item };
        let key = item.$key;
        delete tempItem.$key;
        tempItem.status = this._helperService.getNewStatusValue(item.status);
        this._modelService.saveItem({ item: tempItem, key }, { task: 'update-by-key', });
    }
}
