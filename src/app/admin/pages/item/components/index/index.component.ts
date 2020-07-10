import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';
import { PageService } from '../../services/page.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { IItem } from 'src/app/shared/defines/item.interface';
import { Router } from '@angular/router';
import { Conf } from 'src/app/shared/defines/conf';
import { createCssSelector } from '@angular/compiler/src/render3/view/template';

declare let $: any;
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    public _controller: string;
    public _items: IItem[];

    constructor(
        public _helperService: HelperService,
        private _pageService: PageService,
        private _modelService: _ModelService,
        private _router: Router,
        private _conf: Conf,
    ) { }

    ngOnInit(): void {
        // assign controller
        this._controller = this._pageService._controller;
        this._modelService.controller = this._controller;

        this.listData();
    }

    private listData(): void {
        this._modelService.listItems({}, {
            doneCallback: (data: IItem[]) => {

                this._items = data;
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
