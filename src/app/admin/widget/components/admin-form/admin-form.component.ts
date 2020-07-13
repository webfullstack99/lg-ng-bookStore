import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: '[appAdminForm]',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {

    @Input('formData') _formData: any[];
    @Input('appAdminForm') _formProfile: FormGroup;
    @Input('currentItem') _currentItem: any;
    @Input('selectedFiles') _selectedFiles: any;
    @Output('_onSelectedFiles') _onSelectedFile = new EventEmitter<any>();
    @Output('onSubmit') _onSubmit = new EventEmitter<any>();

    constructor(
        public _helperService: HelperService,
        public _conf: Conf,
    ) { }

    ngOnInit(): void {
    }

    public onSubmitForm(): void {
        this._onSubmit.emit(this._formProfile);
    }

    public onFileChange($event): void {
        this._onSelectedFile.emit($event);
    }

    public isFormValid(): boolean {
        return this._formProfile.valid && this._formProfile.dirty;
    }

    public getClass(type: string): any {
        return this._conf.template.form.admin[type];
    }

    public getDefaultSelectContent(name: string): string {
        return `select ${name}`;
    }

    public getPropertyString(propertyObj): string {
        let result: string = '';
        for (let key in propertyObj)
            result += ` ${key}="${propertyObj[key]}"`;
        return result;
    }
}

