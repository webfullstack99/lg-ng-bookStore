import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AdminModelService } from 'src/app/admin/shared/services/admin-model.service';

@Component({
    selector: 'app-show-and-push-data',
    templateUrl: './show-and-push-data.component.html',
    styleUrls: ['./show-and-push-data.component.css']
})
export class ShowAndPushDataComponent implements OnInit {

    @Input('items') _items: any;
    @Input('controller') _controller: any;
    constructor(
        public _helperService: HelperService,
        private _adminModel: AdminModelService,
    ) { }

    ngOnInit(): void {
        this._adminModel.controller = this._controller;
    }

    public pushData(jsonStr: string): void {
        this._adminModel.pushData(jsonStr);
    }

}
