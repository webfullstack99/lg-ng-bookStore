import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';
import { AdminModelService } from 'src/app/admin/shared/models/admin-model.service';

declare const CKEDITOR: any;
declare const $: any;

@Component({
    selector: '[appAdminForm]',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css']
})

export class AdminFormComponent implements OnInit {

    public _ckEditorVal: string;
    public _formParams: any;
    public _timeoutObj: any;

    @Input('formData') _formData: any[];
    @Input('formType') _formType: string;
    @Input('controller') _controller: string;
    @Input('appAdminForm') _formProfile: FormGroup;
    @Input('currentItem') _currentItem: any;
    @Input('selectedFiles') _selectedFiles: any;
    @Input('ckEditor') _ckEditor: string;
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
            if (this._ckEditor) this.setupCkEditor();
            this.setFormParams();
        }
        //this._formProfile.valueChanges.subscribe((data) => {
        //console.log(this._formProfile.value);
        //})
    }

    private setFormParams(): void {
        let formParams = {};
        for (let key in this._formProfile.controls) {
            let params = this._helperService.getConf_formParams(this._controller)[key];
            if (params) formParams[key] = params;
        }
        this._formParams = formParams;
    }

    protected setupCkEditor(): void {
        if (this.hasCkEditor()) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `/assets/plugins/ckeditor/ckeditor.js`;
            this._elementRef.nativeElement.appendChild(s);

            setTimeout(() => {
                const x = document.createElement('script');
                x.type = 'text/javascript';
                x.innerHTML = `CKEDITOR.replace( '_description' );`;
                this._elementRef.nativeElement.appendChild(x);
            }, this._conf.params.loadCkEditorTime);
            this._ckEditorVal = this._formProfile.controls[this._ckEditor].value;
            this.solveCkEditor();
        }
    }

    private solveCkEditor(): void {
        let $this: AdminFormComponent = this;
        setTimeout(() => {
            CKEDITOR.instances[`_${this._ckEditor}`].on('key', function (e) {
                $this._formProfile.controls[$this._ckEditor].setValue(this.getData())
                $this._ckEditorVal = $this._formProfile.controls[$this._ckEditor].value;
            });
        }, this._conf.params.loadSpecificCkEditor);
    }

    public onSubmitForm(): void {
        if (this.hasCkEditor() && this._formType == 'add') CKEDITOR.instances._description.setData('', function () { this.updateElement(); })
        
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
        if (type != 'off') {
            this._formProfile.controls[name].setErrors({ type: true });
            this._formProfile.controls[name].markAsTouched();
            this._formProfile.controls[name].markAsDirty();
        }
    }

    public getCkEditorMessage(): string {
        let message = '';
        if (this.hasCkEditor) {
            let ckEditorVldParams = this._conf.templateConf[this._controller].formParams[this._ckEditor];
            message = this._strFormat.format(this._conf.message.form.lengthBetween, ckEditorVldParams.min, ckEditorVldParams.max);
        }
        return message;
    }

    public hasCkEditor(): boolean {
        return (this._ckEditor) ? true : false;
    }

    public getFormParam(name: string, paramKey: string): string {
        let param: any = this._formParams[name];
        if (param) if (param) return (param[paramKey]) ? param[paramKey] : '';
        return '';
    }
}

