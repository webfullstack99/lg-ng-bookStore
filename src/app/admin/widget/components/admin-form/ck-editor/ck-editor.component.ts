import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Conf } from 'src/app/shared/defines/conf';

declare const CKEDITOR: any;

@Component({
    selector: '[app-ck-editor]',
    templateUrl: './ck-editor.component.html',
    styleUrls: ['./ck-editor.component.css']
})
export class CkEditorComponent implements OnInit {

    public _classes: any;

    @Input('control') _formControl: FormControl;
    @Input('name') _name: string;
    @Input('displayName') _displayName: string;

    constructor(
        private _conf: Conf,
        private _elementRef: ElementRef,
    ) { }

    ngOnInit() {
        this.setupCkEditor();
        this.solveCkEditor();
        this._classes = this._conf.template.form.admin.textarea;
    }

    private solveCkEditor(): void {
        let $this: CkEditorComponent = this;
        setTimeout(() => {
            CKEDITOR.instances[`_${this._name}`].on('key', function (e) {
                $this._formControl.setValue(this.getData());
            });
        }, this._conf.params.loadSpecificCkEditor);
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
}
