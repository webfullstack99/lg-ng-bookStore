const _pageConfig = new pageConfig();

import { Component, OnInit, ElementRef } from '@angular/core';
import { UserModelService as _ModelService } from 'src/app/admin/shared/models/user-model.service';
import { UserValidate as _MainValidate } from 'src/app/admin/shared/validates/user.validate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pageConfig } from '../../defines/pageConfig';
import { Conf } from 'src/app/shared/defines/conf';
import { FormGeneral } from '../../../form.general';
import { CustomValidators } from 'src/app/admin/shared/defines/custom-validators';


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

        private _elementRef: ElementRef,
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
    protected initiateFormProfile(): void {
        let formData = {
            username: [this._helperService.getVal(this._currentItem, 'username.value') || ''],
            email: [this._helperService.getVal(this._currentItem, 'email.value') || ''],
            fullName: [this._helperService.getVal(this._currentItem, 'fullName.value') || ''],
            password: [''],
            password_confirmed: [''],
            group: [this._helperService.getVal(this._currentItem, 'group.name.value') || ''],
            status: [this._currentItem.status || ''],
            thumb: [''],
        }
        new _MainValidate().runValidate(this._currentItem, formData)
        this._formProfile = this._formBuilder.group(formData, {
            validators: CustomValidators.matchPassword('password', 'password_confirmed')
        });
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;
            let callbacks: any = {
                // upload in progress call back
                progressCallback: (upload: Upload) => {
                    this._uploadProgress = upload._progress;
                },

                doneCallback: this.getSavingDoneCallback()
            }

            // solve submit
            let item = { ... this._submittedForm };
            item.password = (this._submittedForm.password.trim() != '')
                ? this._helperService.md5(this._submittedForm.password)
                : this._currentItem.password;
            if (this._formType == 'edit') this.solveEditSubmitHasThumb(callbacks, item);
            else this.solveAddSubmit(callbacks, item);

            // reset add form
            if (this._formType == 'add') this.resetForm();
        }
    }
}
