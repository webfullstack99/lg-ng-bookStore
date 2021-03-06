import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { AdminModelService } from 'src/app/admin/shared/models/admin-model.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { UploadService } from 'src/app/shared/services/upload.service';
import { BehaviorSubject } from 'rxjs';


declare const $: any;
declare const CKEDITOR: any;

@Component({
    selector: '[appAdminForm]',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css'],

})

export class AdminFormComponent implements OnInit {

    public _formParams: any;
    public _timeoutObj: any = {};
    public _editor = DocumentEditor
    public _croppedImageBehaviorSubject = new BehaviorSubject<any>('');
    public _dbSelectData: any[] = [];

    @Input('formData') _formData: any[];
    @Input('formType') _formType: string;
    @Input('controller') _controller: string;
    @Input('appAdminForm') _formProfile: FormGroup;
    @Input('currentItem') _currentItem: any;
    @Input('editor') _ckEditor: string;
    @Output('onSubmit') _onSubmit = new EventEmitter<any>();

    constructor(
        public _uploadService: UploadService,
        public _helperService: HelperService,
        public _conf: Conf,
        private _elementRef: ElementRef,
        private _strFormat: StrFormatService,
        private _adminModel: AdminModelService,
    ) { }

    ngOnInit(): void {
        this._adminModel.controller = this._controller;
        if (this._controller) this.setFormParams();
        this._adminModel.getAllDbSelectData((data: any[]) => {
            this._dbSelectData = data;
        })
    }

    // setup
    private setFormParams(): void {
        let formParams = {};
        for (let key in this._formProfile.controls) {
            let params = this._helperService.getConf_formParams(this._controller)[key];
            if (params) formParams[key] = params;
        }
        this._formParams = formParams;
    }

    public isFormValid(): boolean {
        return this._formProfile.valid && this._formProfile.dirty;
    }

    public getDefaultSelectContent(name: string): string {
        return `select ${name}`;
    }

    // $event
    public onSubmitForm(): void {
        this._onSubmit.emit(this._formProfile);
        if (this._formType == 'add') this.resetEditor();
        this._croppedImageBehaviorSubject.next('');
        this.resetForm();
    }

    private resetForm(): void {
        if (this._formType == 'add') this._formProfile.reset();
        else this._formProfile.markAsPristine();
        this._helperService.setDefaultTextForCustomFileInput()
    }

    public onInputHasOptionsKeyup($event: any, name: string, options: any): void {
        let value: string = $event.target.value;
        if (options) {
            switch (options.type) {
                case 'create-slug':
                    let slug = this._helperService.slug(value);
                    this.setFormControlValue(options.field, slug);
                    if (options.isPartnerUnique) this.checkUnique(options.field, slug);
                    if (options.isUnique) this.checkUnique(name, value);
                    break;

                case 'unique':
                    this.checkUnique(name, value);
                    break;
            }
        }
    }

    // classes
    public getSpecialClass(name: string): string {
        let classes: string = ''
        if (name == 'password_confirmed') return 'password-confirmed-input';
        return classes;
    }

    public getClass(type: string): any {
        return this._conf.template.form.admin[type];
    }

    // manipulate form controls
    public getFormParam(name: string, paramKey: string): string {
        let param: any = this._formParams[name];
        if (param) if (param) return (param[paramKey]) ? param[paramKey] : '';
        return '';
    }

    private showError(name: string, type?: string) {
        this.setFormControlErrors(name, type)
    }

    private checkUnique(name: string, value: string) {
        clearTimeout(this._timeoutObj[name]);
        this._timeoutObj[name] = setTimeout(() => {
            let searchFields: string[] = this._helperService.getConf_searchFields(this._controller);
            let fieldPath: string = (searchFields.includes(name)) ? `${name}/forSearch` : name;
            this._adminModel.checkExist({
                key: this._currentItem.$key,
                fieldPath,
                value,
                controller: this._controller
            }, {
                doneCallback: (exist: boolean) => {
                    if (exist) this.showError(name, 'unique');
                }
            })
        }, this._conf.params.delayForSearchTime);
    }

    private setFormControlValue(name: string, value: string): void {
        this._formProfile.controls[name].setValue(value);
        this._formProfile.controls[name].markAsTouched();
        this._formProfile.controls[name].markAsDirty();
        this._formProfile.controls[name].updateValueAndValidity();
    }

    private setFormControlErrors(name: string, type: any): void {
        let err = (type) ? { [type]: true } : type;
        this._formProfile.controls[name].setErrors(err);
        this._formProfile.controls[name].markAsTouched();
        this._formProfile.controls[name].markAsDirty();
    }

    // ckeditor
    private resetEditor(): void {
        $('.ck.ck-content > p').html('');
    }

    public hasCkEditor(): boolean {
        return (this._ckEditor) ? true : false;
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

    public getDbSelectData(name: string): any[] {
        for (let item of this._dbSelectData) {
            if (name == item.field) return item.data;
        }
    }

    public print(value): void {
        return value;
    }
}

