import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';
import { PageService } from '../../services/page.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { IItem } from 'src/app/shared/defines/item.interface';

declare let $: any;
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    public _controller: string;
    public _items: IItem[] = [];

    constructor(
        public _helperService: HelperService,
        private _pageService: PageService,
        private _modelService: _ModelService,
    ) { }

    ngOnInit(): void {
        // assign controller
        this._controller = this._pageService._controller;
        this._modelService.controller = this._controller;

        this.listData();
    }

    private listData(): void {
        this._modelService.listItems({}, {}, (data) => {
            this._items = data;
        })
    }

    // Edit item
    public onEditClick(item: IItem): void {
        console.log('edit');
        console.log(item);
    }

    // Delete item
    public onDeleteClick(item: IItem): void {
        $(`tr[data-key="${item.$key}"]`).addClass('bg-delete-warning');
        this._modelService.saveItem({ item }, { task: 'delete-one' });
    }
}
