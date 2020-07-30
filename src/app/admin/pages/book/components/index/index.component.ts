const _pageConfig = new pageConfig();

import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Router } from '@angular/router';
import { Conf } from 'src/app/shared/defines/conf';
import { UrlService } from 'src/app/shared/services/url.service';
import { HighlightService } from 'src/app/shared/services/highlight.service';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { AdminController } from '../../../admin.controller';

import { BookModelService as _ModelService } from 'src/app/admin/shared/models/book-model.service';
import { pageConfig } from '../../defines/pageConfig';
import { IBook } from 'src/app/shared/defines/book.interface';

declare let $: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
})

export class IndexComponent extends AdminController implements OnInit {
    public _controller: string;
    public _items: IBook[] = [];
    public _selectedItems: IBook[] = [];
    public _clientFilter: any = {};
    public _filterCount: any = {};
    public _pagination: any = {};
    public _hasData: boolean;
    public _changeActionField: string;

    constructor(
        public _helperService: HelperService,
        public _highlightService: HighlightService,
        public _conf: Conf,
        protected _modelService: _ModelService,
        protected _urlService: UrlService,
        protected _router: Router,
        protected _strFormat: StrFormatService,
    ) {
        super(_highlightService, _helperService, _conf, _strFormat, _router);
    }

    ngOnInit(): void {
        // assign controller
        this._controller = _pageConfig._controller;
        this._modelService.controller = this._controller;
        this._pagination = this._helperService.getConf_pagination(this._controller);

        this._urlService.getClientFilter(this._controller, (clientFilter: any) => {
            this._clientFilter = clientFilter;
            this._selectedItems = [];
            this.listData();
        })
    }


    // List item
    protected listData(): void {
        this.onList();
    }

    // Edit item
    public onEditClick(item: any): void {
        this.onEdit(item);
    }

    // Delete item
    public onDeleteClick(item: any): void {
        this.onDelete(item, item.title.value);
    }

    /**
     * Determines whether action click on
     * @param data {action, item}
     */
    public onActionClick(data: any): void {
        this.onAction(data);
    }

    public onStatusClick(item: any): void {
        this.onFieldButton('status', item);
    }

    public onSpecialClick(item: any): void {
        this.onFieldButton('special', item);
    }

    public onSaleOffChange(item: any, value: string): void {
        this.onFieldChange(item, 'saleOff', value);
    }

    public onPriceChange(item: any, value: string): void {
        this.onFieldChange(item, 'price', value);
    }

    public onCategoryChange(item: any, value: string): void {
        this.onFieldChange(item, 'category', {fieldPath: 'slug', value}, 'relational-field');
    }
}
