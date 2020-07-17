import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';

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
    public _message: string;

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
        public _strFormat: StrFormatService,
    ) { }

    ngOnInit() {
        this._inputVal = this._item[this._field];
        this._originVal = this._inputVal;
        this._vldParams = (this._helperService.getConf_vldParams(this._controller)[this._field])
            ? this._helperService.getConf_vldParams(this._controller)[this._field]
            : null;
    }

    public getAttr(name: string): string {
        if (['_min', '_max'].includes(name)) {
            return this._vldParams[name.replace(/^_/, '')];
        } else {
            if (this[name]) return `${this[name]}`;
            return '';
        }
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

    private onCheck($event: any): boolean {
        let value: any = $event.target.value;
        let flag: boolean = true;

        if (value.trim() != '') {
            let n = this.toVldNumber(value);
            if (this._vldParams.min) flag = (n < this._vldParams.min) ? false : true;
            if (this._vldParams.max && flag) flag = (n > this._vldParams.max) ? false : true;
        } else flag = false;

        // ok
        if (flag) return true;

        // fail
        this.reset($event);
        this._helperService.notifier({
            notifierData: {
                type: this._conf.message.crud[`update_invalid`].type,
                message: this._conf.message.crud[`update_invalid`].content,
            }
        }, 'show')
        return false;
    }

    public onKeyup($event: any): void {
        let value = $event.target.value;
        let n = this.toVldNumber(value);
        if (this._vldParams && (value.trim() == '' || n < this._vldParams.min || n > this._vldParams.max)) this.showMessage();
        else this._message = null;
    }

    public showMessage() {
        let messageType: string = (this._type == 'number') ? 'between' : 'lengthBetween';
        this._message = this._strFormat.format(this._conf.message.form[messageType], this._vldParams.min, this._vldParams.max);
    }

    public toVldNumber(value: any): number {
        if (value) {
            switch (this._type) {
                case 'number':
                    return Number.parseFloat(value);

                default:
                    return value.length;
            }
        }
    }

    private reset($event: any): void{
        $($event.target).val(this._originVal);
        this._message = null;
    }
}   