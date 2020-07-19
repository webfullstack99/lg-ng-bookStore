import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-show-error-message',
    templateUrl: './show-error-message.component.html',
    styleUrls: ['./show-error-message.component.css']
})
export class ShowErrorMessageComponent implements OnInit {

    @Input('field') _field: string;
    @Input('control') _control: FormControl;
    @Input('group') _group: FormGroup;
    @Input('displayName') _displayName: string;
    @Input('forceMessage') _forceMessage: any;


    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
        public strFormat: StrFormatService,
    ) { }

    ngOnInit() { }

    public isShow(type: string = 'control'): boolean {
        if (type == 'control') {
            if (!this._control.valid && this._control.dirty) return true;
        } else {
            if (this._group.controls[this._field].dirty && !this._group.valid) return true;
        }
        return false;
    }

    public getMessage(type: string = 'control'): string {
        let errorType: string;
        let err: any;
        if (type == 'control') {
            errorType = Object.keys(this._control.errors)[0];
            err = this._control.errors[errorType];
        } else if (type == 'group') {
            errorType = Object.keys(this._group.errors)[0];
            err = this._group.errors[errorType];
        }
        let messageData = this._conf.message.form;
        let message: string;
        switch (errorType) {
            case 'lengthBetween':
            case 'between':
                message = this.strFormat.format(messageData[errorType], err.min, err.max);
                break;

            case 'matchPassword':
                message = this.strFormat.format(messageData[errorType]);
                break;

            default:
                message = `${this._displayName} is invalid`;
                break;
        }
        return message;
    }
}
