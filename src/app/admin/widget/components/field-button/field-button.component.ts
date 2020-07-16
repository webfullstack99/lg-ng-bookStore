import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-field-button',
    templateUrl: './field-button.component.html',
    styleUrls: ['./field-button.component.css']
})
export class FieldButtonComponent implements OnInit {

    public _myBtn: any;

    @Input('field') _field: string;
    @Input('item') _item: any;
    @Output('onClick') _onClick = new EventEmitter<any>();

    constructor(
        public _conf: Conf,
    ) { }

    ngOnInit() {
        this._myBtn = this._conf.template.format.button[this._field][this._item[this._field]];
    }

    public getClasses(): object{
        return {
            [`${this._field}-btn`]: true,
            [this._myBtn.classes]: true,
        }
    }

    public onClick(item: any): void{
        this._onClick.emit(item);
    }
}
