import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-field-input',
    templateUrl: './fieldInput.component.html',
    styleUrls: ['./fieldInput.component.css']
})
export class FieldInputComponent implements OnInit {

    public _inputVal: any;

    @Input('item') _item: any;
    @Input('field') _field: string;
    @Input('type') _type: string;
    @Input('step') _step: number;

    @Output('onChange') _onChange = new EventEmitter<string>();

    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
    ) { }

    ngOnInit() {
        this._inputVal = this._item[this._field];
    }

    public onChange(value: string) {
        this._inputVal = value;
        let timeout: any;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            this._onChange.emit(value);
        }, this._conf.params.shortInputChangeTimeout);
    }

    public getAttr(name: string): string{
        if (this[name]) return `${this[name]}`;
        return '';
    }
}
