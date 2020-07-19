import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { AdminModelService } from 'src/app/admin/shared/models/admin-model.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

declare const $: any;
declare const CKEDITOR: any;

@Component({
    selector: '[appAdminForm]',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css']
})

export class AdminFormComponent implements OnInit {

    public _formParams: any;
    public _timeoutObj: any;
    public _editor = DocumentEditor

    @Input('formData') _formData: any[];
    @Input('formType') _formType: string;
    @Input('controller') _controller: string;
    @Input('appAdminForm') _formProfile: FormGroup;
    @Input('currentItem') _currentItem: any;
    @Input('selectedFiles') _selectedFiles: any;
    @Input('editor') _ckEditor: string;
    @Output('_onSelectedFiles') _onSelectedFile = new EventEmitter<any>();
    @Output('onSubmit') _onSubmit = new EventEmitter<any>();

    constructor(
        public _helperService: HelperService,
        public _conf: Conf,
        private _elementRef: ElementRef,
        private _strFormat: StrFormatService,
        private _adminModel: AdminModelService,
    ) { }

    ngOnInit(): void {
        if (this._controller) {
            this.setFormParams();
        }
    }

    private setFormParams(): void {
        let formParams = {};
        for (let key in this._formProfile.controls) {
            let params = this._helperService.getConf_formParams(this._controller)[key];
            if (params) formParams[key] = params;
        }
        this._formParams = formParams;
    }

    public onSubmitForm(): void {
        this._onSubmit.emit(this._formProfile);
        if (this._formType == 'add') this.resetEditor();
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

    public onKeyup($event: any, name: string, options: any): void {
        let value: string = $event.target.value;
        if (options) {
            switch (options.type) {
                case 'create-slug':
                    let slug = this._helperService.slug(value);
                    this._formProfile.controls[options.field].setValue(slug);
                    if (options.isPartnerUnique) this.checkUnique(options.field, options.field, slug);
                    break;
                case 'unique':
                    this.checkUnique(name, name, value);
                    break;
            }
        }
    }

    private checkUnique(name, fieldPath: string, value: string) {
        clearTimeout(this._timeoutObj);
        this._timeoutObj = setTimeout(() => {
            this._adminModel.checkExist({ key: this._currentItem.$key, fieldPath, value, controller: this._controller }, {
                doneCallback: (exist: boolean) => {
                    if (exist) this.showMessage(name, 'unique');
                    else this.showMessage(name, 'off');
                }
            })
        }, this._conf.params.delayForSearchTime);
    }

    private showMessage(name: string, type?: string) {
        if (type != 'off') this.setFormControlErrors(name, type)
        else this.setFormControlErrors(name, null);
    }

    public hasCkEditor(): boolean {
        return (this._ckEditor) ? true : false;
    }

    public getFormParam(name: string, paramKey: string): string {
        let param: any = this._formParams[name];
        if (param) if (param) return (param[paramKey]) ? param[paramKey] : '';
        return '';
    }

    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }

    public onEditorChange({ editor }: ChangeEvent): void {
        this.setFormControlValue(this._ckEditor, editor.getData());
    }

    private setFormControlValue(name: string, value: string): void {
        this._formProfile.controls[name].setValue(value);
        this._formProfile.controls[name].markAsTouched();
        this._formProfile.controls[name].markAsDirty();
        this._formProfile.controls[name].updateValueAndValidity();
    }

    private setFormControlErrors(name: string, type: any): void {
        type = (type) ? { [type]: true } : type;
        this._formProfile.controls[name].setErrors(type);
        this._formProfile.controls[name].markAsTouched();
        this._formProfile.controls[name].markAsDirty();
        this._formProfile.controls[name].updateValueAndValidity();
    }

    private resetEditor(): void {
        $('.ck.ck-content > p').html('');
    }
}

