import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { StrFormatService } from 'src/app/shared/services/str-format.service';

declare const CKEDITOR: any;
declare const $: any;

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
    @Input('ckEditor') _ckEditor: string;
    @Output('_onSelectedFiles') _onSelectedFile = new EventEmitter<any>();
    @Output('onSubmit') _onSubmit = new EventEmitter<any>();

    constructor(
        public _helperService: HelperService,
        public _conf: Conf,
        private _elementRef: ElementRef,
        private _strFormat: StrFormatService,
    ) { }

    ngOnInit(): void {
        this.setupCkEditor();
        this.solveCkEditor();
        this._formProfile.valueChanges.subscribe((data) => {
            console.log(this._formProfile.value);
        })
    }

    protected setupCkEditor(): void {
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

    }

    private solveCkEditor(): void {
        let $this: AdminFormComponent = this;
        setTimeout(() => {
            CKEDITOR.instances[`_${this._ckEditor}`].on('key', function (e) {
                $this._formProfile.controls[$this._ckEditor].markAsTouched();
                $this._formProfile.controls[$this._ckEditor].setValue(this.getData());
                $this._formProfile.controls[$this._ckEditor].patchValue(this.getData());
                $this._formProfile.controls[$this._ckEditor].markAsDirty();
                $this._formProfile.controls[$this._ckEditor].updateValueAndValidity();
                $this._formProfile.updateValueAndValidity();
            });
        }, this._conf.params.loadSpecificCkEditor);
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

    public onKeyup($event: any, name: string, options: any): void {
        let value: string = $event.target.value;
        if (options) {
            switch (options.type) {
                case 'slug':
                    this._formProfile.controls[options.for].setValue(this._helperService.slug(value));
                    break;
            }
        }
    }

    public getCkEditorMessage(): string {
        let message = '';
        let control = this._formProfile.controls[this._ckEditor];
        console.log(control.errors);
        if (control.dirty && control.invalid) {
            let errorType: string = Object.keys(control.errors)[0];
            if (errorType) {
                let err: any = control.errors[errorType];
                console.log(err);
                if (errorType == 'lengthBetween') message = this._strFormat.format(this._conf.message.form.lengthBetween, err.min, err.max);
                else message = `${this._ckEditor} is invalid`;
            }
        }

        return message;
    }
}

