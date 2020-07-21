import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { Conf } from 'src/app/shared/defines/conf';
import { stringify } from 'querystring';

@Component({
    selector: 'app-show-error-message',
    templateUrl: './show-error-message.component.html',
    styleUrls: ['./show-error-message.component.css']
})
export class ShowErrorMessageComponent implements OnInit {

    @Input('field') _field: string;
    @Input('displayName') _displayName: string;
    @Input('forceMessage') _forceMessage: any;
    @Input('control') _control: FormControl;
    @Input('group') _group: FormGroup;

    public _messageType: string;

    constructor(
        public _conf: Conf,
        public _helperService: HelperService,
        public strFormat: StrFormatService,
    ) { }

    ngOnInit() { }

    public isShow(type: string = 'control'): boolean {
        if (type == 'control') {
            if (this.getMessage() && !this._control.valid && this._control.dirty) return true;
        } else {
            if (!this._group.valid) return true;
        }
        return false;
    }

    public getMessage(type: string = 'control'): any {
        if (type == 'control') {
            for (let key in this._control.errors) {
                this._messageType = (key == 'password') ? 'array' : 'string';
                return this.showError(key, type);
            }
        } else {
            for (let key in this._group.errors) {
                this._messageType = 'string';
                return this.showError(key, type);
            }
        }
    }

    private showError(errorType: string, type: string): any {
        let message: string = '';
        let messageData = this._conf.message.form;
        let err: any = (type == 'control') ? this._control.errors[errorType] : this._group.errors[errorType];
        switch (errorType) {
            case 'lengthBetween':
            case 'between':
                message = this.strFormat.format(messageData[errorType], err.min, err.max);
                break;

            case 'password':
                return this.solvePasswordMessage();

            case 'unique':
                message = this.strFormat.format(messageData[errorType], this._displayName);
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

    private solvePasswordMessage(): any[] {
        let messages = {
            space: `Do not contain space`,
            digit: 'At least one digit.',
            special: 'At least one special symbol.',
            uppercase: 'At least one uppercase letter.',
            length: `Be at least 8 characters.`,
        }
        let result: any[] = [];
        if (this._control.errors) {
            for (let key in this._control.errors.password) {
                let msg: any = {
                    message: messages[key],
                    status: (this._control.errors.password[key]) ? true : false,
                }
                result.push(msg);
            }
        }
        return result;
    }

    public getMessageClassObj(status: boolean): Object {
        return {
            'mt-1': true,
            'd-block': true,
            'text-danger': status,
            'text-success': !status,
        }
    }

    public getStatusSymbolClassObj(status: boolean): Object {
        return {
            'far fa-fw': true,
            'fa-times text-danger': status,
            'fa-check text-success': !status,
        }
    }

    public isType(value: any): string {
        return typeof value;
    }
}
