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

    public isShow(): boolean {
        if (!this._control.valid && this._control.dirty) return true;
        return false;
    }

    public getMessage(): string {
        let errorType: string = Object.keys(this._control.errors)[0];
        let err: any = this._control.errors[errorType];
        let messageData = this._conf.message.form;
        let message: string;
        switch (errorType) {
            case 'lengthBetween':
                message = this.strFormat.format(messageData.lengthBetween, err.min, err.max);
                break;

            case 'between':
                message = this.strFormat.format(messageData.between, err.min, err.max);
                break;

            default:
                message = `${this._displayName} is invalid`;
                break;
        }
        return message;
    }
}
