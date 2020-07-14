import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HighlightService } from 'src/app/shared/services/highlight.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { Router } from '@angular/router';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';

declare const $: any;

@Injectable({
    providedIn: 'root'
})
export abstract class AdminController {
    public _controller;
    public _items;
    public _clientFilter;
    public _filterCount;
    public _pagination;
    public _selectedItems;
    public _hasData;
    public _changeActionField;
    protected _modelService;

    constructor(
        public _highlightService: HighlightService,
        public _helperService: HelperService,
        public _conf: Conf,
        protected _strFormat: StrFormatService,
        protected _router: Router,
    ) { }

    // Change status
    public onStatusClick(item: any): void {
        let tempItem = { ...item };
        let key = item.$key;
        delete tempItem.$key;
        tempItem.status = this._helperService.getNewStatusValue(item.status);
        this._modelService.saveItem({ updateData: { status: tempItem.status, }, key }, { task: 'update-by-key', });
        this._selectedItems = [];
    }

    /**
     * Determines whether select on
     * @param data - {$key, isChecked}
     */
    public onSelect(data: any): void {
        if (data.isChecked) this._selectedItems.push(data.item);
        else this._selectedItems.splice(this._selectedItems.indexOf(data.item), 1);
    }

    public onCheckAll(isChecked: boolean): void {
        if (isChecked) {
            this._selectedItems = this._items;
            this._helperService.selectAllItems();
        } else {
            this._selectedItems = [];
            this._helperService.unSelectAllItems();
        }
    }

    public getTotalItemSelected(): number {
        return this._selectedItems.length;
    }

    /**
     * Determines whether submitted action on
     * @param data - {task, value}
     */
    public onSubmittedAction(data: any): void {
        this._modelService.changeMulti(data, this._selectedItems, () => {
            if (data.task == 'delete') this._selectedItems = [];
            else {
                if (this._clientFilter.filter[data.field] != 'all') this._selectedItems = [];
                else {
                    this._selectedItems = this._helperService.syncSelectItemsWithChanges(this._selectedItems, data);
                    this._helperService.selectItems(this._selectedItems);
                }
            }
        });
    }

    // main methods
    protected onList(): void {
        this._modelService.listItems({
            clientFilter: this._clientFilter,
            pagination: this._pagination,
        }, {
            task: 'list-for-main-table',
            freshDataCallback: (items: any[]) => {
                if (items) if (items.length > 0) {
                    this._hasData = true;
                    this._filterCount = this._modelService.countFilter(items);
                }
            },
            beforePaginationCallback: (length: number) => {
                this._pagination.totalItems = length;
                this._pagination.behaviorSubject.next(this._pagination);
            },
            doneCallback: (data: any[]) => {
                this._items = this._highlightService.highlightSearchDataForAdminMainTable(this._clientFilter, data, this._controller);
            }
        });

    }

    protected onEdit(item: any): void {
        this._router.navigate([this._conf.prefix.admin, this._controller, 'form', item.$key]);
    }

    protected onDelete(item: any, displayName: string): void {
        let slt = `tr[data-key="${item.$key}"]`;
        $(slt).addClass('bg-delete-warning');
        setTimeout(() => {
            let r = confirm(this._strFormat.format(this._conf.message.crud.DELETE_WARNING, displayName));
            if (r) this._modelService.saveItem({ item }, { task: 'delete-by-key' });
            else $(slt).removeClass('bg-delete-warning');
        }, this._conf.params.delayForAvoidAsyncTime);

    }

    protected onAction(data: any): void {
        this[`on${this._helperService.ucfirst(data.action)}Click`](data.item);
    }
}
