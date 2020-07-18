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
    public _formParams: any;
    public _message: string;
    public _timeoutObj: any;

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
        this.setFormParams();
    }

    private setFormParams(): void {
        this._formParams = this._helperService.getConf_formParams(this._controller)[this._field];
    }

    public getAttr(name: string): string {
        if (this._formParams) return this._formParams[name];
        return '';
    }

    public onChange($event: any) {
        let value = $event.target.value;
        this._inputVal = value;
        clearTimeout(this._timeoutObj);
        this._timeoutObj = setTimeout(() => {
            console.log('timeout');
            if (this.onCheck($event)) this._onChange.emit(value);
        }, this._conf.params.shortInputChangeTimeout);
    }

    private onCheck($event: any): boolean {
        let value: any = $event.target.value;
        let flag: boolean = true;

        if (value.trim() != '') {
            let n = this.toVldNumber(value);
            if (this._formParams.min) flag = (n < this._formParams.min) ? false : true;
            if (this._formParams.max && flag) flag = (n > this._formParams.max) ? false : true;
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
        if (this._formParams && (value.trim() == '' || n < this._formParams.min || n > this._formParams.max)) this.showMessage();
        else this._message = null;
    }

    public showMessage() {
        let messageType: string = (this._type == 'number') ? 'between' : 'lengthBetween';
        this._message = this._strFormat.format(this._conf.message.form[messageType], this._formParams.min, this._formParams.max);
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

    private reset($event: any): void {
        $($event.target).val(this._originVal);
        this._message = null;
    }
}   