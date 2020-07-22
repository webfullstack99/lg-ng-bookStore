import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: 'app-field-select',
    templateUrl: './field-select.component.html',
    styleUrls: ['./field-select.component.css']
})
export class FieldSelectComponent implements OnInit {

    public _selectData: string[];

    @Input('field') _field: string;
    @Input('item') _item: any;

    @Output('onChange') _onChange = new EventEmitter<string>();

    constructor(
        public _helperService: HelperService,
    ) { }

    ngOnInit() {
        this._selectData = this._helperService.getConf_selectData()[this._field];
    }

    public onChange(value: string): void {
        this._onChange.emit(value);
    }
}
