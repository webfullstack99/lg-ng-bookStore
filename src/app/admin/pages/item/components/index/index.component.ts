import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    public _controller: string = 'item';
    public _items: object[];

    constructor(
        private _modelService: _ModelService,
    ) { }

    ngOnInit(): void {
        this._modelService.controller = this._controller;
        this._modelService.listItems({}, {}, (data) => {
            this._items = data;
            console.log(data);
            
        })
    }


}
