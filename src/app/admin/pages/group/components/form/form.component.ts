const _pageConfig = new pageConfig();

import { Component, OnInit } from '@angular/core';
import { GroupModelService as _ModelService } from 'src/app/admin/shared/models/group-model.service';
import { GroupValidate as _MainValidate } from 'src/app/admin/shared/validates/group.validate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pageConfig } from '../../defines/pageConfig';
import { Conf } from 'src/app/shared/defines/conf';
import { FormGeneral } from '../../../form.general';


declare var $: any;

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    providers: [],
})
export class FormComponent extends FormGeneral implements OnInit {

    public _controller: string;
    public _formType: string;
    public _submittedForm: any;
    public _currentItem: any = {};
    public _uploadProgress: number;
    public _formProfile: FormGroup;

    constructor(
        public _conf: Conf,
        protected _modelService: _ModelService,
        protected _helperService: HelperService,
        protected _formBuilder: FormBuilder,
        protected _activatedRoute: ActivatedRoute,
    ) {
        super(_conf, _helperService, _formBuilder, _activatedRoute);
    }

    ngOnInit(): void {
        // assign controller
        this._controller = _pageConfig._controller;
        this._modelService.controller = this._controller;
        this.initForm();
    }

    // HAS THUMB
    // OVERRIDE
    protected initiateFormProfile(): void {
        let formData = {
            name: [this._helperService.getVal(this._currentItem, 'name.value') || ''],
            acp: [this._currentItem.acp || ''],
            status: [this._currentItem.status || ''],
        }
        new _MainValidate().runValidate(this._currentItem, formData)
        this._formProfile = this._formBuilder.group(formData);
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            let callbacks: any = {
                // upload in progress call back
                progressCallback: (upload: Upload) => {
                    this._uploadProgress = upload._progress;
                },
                doneCallback: this.getSavingDoneCallback(),
            }

            // solve submit
            if (this._formType == 'edit') this.solveEditSubmitNoThumb(callbacks);
            else this.solveAddSubmit(callbacks);
        }
    }
}
