import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';

declare const $: any;

@Component({
    selector: 'app-field-input',
    templateUrl: './fieldInput.component.html',
    styleUrls: ['./fieldInput.component.css']
})
export class FieldInputComponent implements OnInit {

    public _inputVal: any;
    public _originVal: any;
    public _vldParams: any;

    @Input('controller') _controller: string;
    @Input('item') _item: any;
    @Input('field') _field: string;
    @Input('type') _type: string;
    @Input('step') _step: number;
    @Input('min') _min: number;
    @Input('max') _max: number;

    @Output('onChange') _onChange = new EventEmitter<string>();

    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
    ) { }

    ngOnInit() {
        this._inputVal = this._item[this._field];
        this._originVal = this._inputVal;
        this._vldParams = (this._helperService.getConf_vldParams(this._controller)[this._field])
            ? this._helperService.getConf_vldParams(this._controller)[this._field]
            : null;
        console.log(this._vldParams);

    }

    public onChange($event: any) {
        let value = $event.target.value;
        if (this.onCheck($event)) {
            this._inputVal = value;
            let timeout: any;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this._onChange.emit(value);
            }, this._conf.params.shortInputChangeTimeout);
        }
    }

    public getAttr(name: string): string {
        if (['_min', '_max'].includes(name)) {
            return this._vldParams[name.replace(/^_/, '')];
        } else {
            if (this[name]) return `${this[name]}`;
            return '';
        }
    }

    private onCheck($event: any): boolean {
        let value: any = $event.target.value;
        let flag: boolean = true;
        if (value != null) {
            switch (this._type) {
                case 'number':
                    value = Number.parseFloat(value);
                    if (this._vldParams.min) flag = (value < this._vldParams.min) ? false : true;
                    if (this._vldParams.max && flag) flag = (value > this._vldParams.max) ? false : true;
                    break;
            }
        } else flag = false;

        // ok
        if (flag) return true;

        // fail
        $($event.target).val(this._originVal);
        this._helperService.notifier({
            notifierData: {
                type: this._conf.message.crud[`update_invalid`].type,
                message: this._conf.message.crud[`update_invalid`].content,
            }
        }, 'show')
        return false;
    }

}   